"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import OpenAI from "openai";
import { OPENAI_MODELS, MODEL_CONFIG } from "./models";

// Type definitions for structured summary
interface KeyInsight {
  text: string;
  type: "finding" | "recommendation" | "warning" | "statistic" | "conclusion";
}

interface Section {
  title: string;
  content: string;
}

interface StructuredSummary {
  summary: string;
  keyInsights: KeyInsight[];
  sections: Section[];
  suggestedQuestions: string[];
}

type SummaryFormat = "bullet" | "paragraph" | "detailed";

// Generate summary from PDF document
export const generateSummary = action({
  args: {
    documentId: v.id("documents"),
    format: v.union(
      v.literal("bullet"),
      v.literal("paragraph"),
      v.literal("detailed")
    ),
    length: v.union(
      v.literal("short"),
      v.literal("medium"),
      v.literal("detailed")
    ),
  },
  handler: async (ctx, args): Promise<{
    summaryId: any;
    content: string;
    model: string;
    tokensUsed: number;
  }> => {
    // Initialize OpenAI client
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const openai = new OpenAI({ apiKey });

    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user from database
    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check usage limits before processing
    const canProcess = await ctx.runQuery(api.usage.checkLimit, {
      action: "upload_document",
      documentPageCount: 0, // Will check in document retrieval
    });

    if (!canProcess.allowed) {
      throw new Error(canProcess.reason || "Usage limit exceeded");
    }

    // Get document with extracted text
    const document = await ctx.runQuery(api.documents.get, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.status !== "ready") {
      throw new Error(
        `Document not ready for summarization. Status: ${document.status}`
      );
    }

    if (!document.extractedText || document.extractedText.length === 0) {
      throw new Error("No text extracted from document");
    }

    // Combine extracted text from all pages
    const fullText = document.extractedText
      .sort((a: any, b: any) => a.pageNumber - b.pageNumber)
      .map((page: any) => `[Page ${page.pageNumber}]\n${page.content}`)
      .join("\n\n");

    if (fullText.trim().length === 0) {
      throw new Error("Document appears to be empty");
    }

    // Build prompt for structured JSON output
    const systemPrompt = buildStructuredSystemPrompt();
    const userPrompt = buildStructuredUserPrompt(fullText, args.format, args.length);

    try {
      // Try with primary model first (gpt-4o-mini)
      let model: string = OPENAI_MODELS.PRIMARY;
      let response;

      try {
        response = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: MODEL_CONFIG.temperature,
          max_tokens: MODEL_CONFIG.maxTokens[args.length] + 1000, // Extra tokens for JSON structure
          top_p: MODEL_CONFIG.top_p,
          frequency_penalty: MODEL_CONFIG.frequency_penalty,
          presence_penalty: MODEL_CONFIG.presence_penalty,
          response_format: { type: "json_object" },
        });
      } catch (error: any) {
        // If primary model fails (rate limit, etc.), fall back to gpt-4o
        if (error.status === 429 || error.code === "rate_limit_exceeded") {
          console.log("Rate limited on primary model, using fallback");
          model = OPENAI_MODELS.FALLBACK;

          response = await openai.chat.completions.create({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: MODEL_CONFIG.temperature,
            max_tokens: MODEL_CONFIG.maxTokens[args.length] + 1000,
            top_p: MODEL_CONFIG.top_p,
            frequency_penalty: MODEL_CONFIG.frequency_penalty,
            presence_penalty: MODEL_CONFIG.presence_penalty,
            response_format: { type: "json_object" },
          });
        } else {
          throw error;
        }
      }

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) {
        throw new Error("No summary generated");
      }

      // Parse the JSON response
      let structuredData: StructuredSummary;
      try {
        structuredData = JSON.parse(rawContent);
      } catch {
        // If JSON parsing fails, use the raw content as the summary
        structuredData = {
          summary: rawContent,
          keyInsights: [],
          sections: [],
          suggestedQuestions: [],
        };
      }

      const normalizedData = normalizeStructuredSummary(structuredData);
      const formattedContent = buildReadableSummary(normalizedData, args.format);

      // Calculate tokens used
      const tokensUsed =
        (response.usage?.prompt_tokens || 0) +
        (response.usage?.completion_tokens || 0);

      // Save summary to database with structured data
      const summaryId = await ctx.runMutation(api.summaries.create, {
        documentId: args.documentId,
        format: args.format,
        length: args.length,
        content: formattedContent,
        keyInsights: normalizedData.keyInsights,
        sections: normalizedData.sections,
        suggestedQuestions: normalizedData.suggestedQuestions,
        model,
        tokensUsed,
      });

      // Increment usage counters
      await ctx.runMutation(internal.usage.increment, {
        userId: user._id,
        documentsProcessed: 1,
        pagesProcessed: document.pageCount,
      });

      return {
        summaryId,
        content: formattedContent,
        model,
        tokensUsed,
      };
    } catch (error: any) {
      console.error("Summarization error:", error);
      throw new Error(
        `Failed to generate summary: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Build system prompt for structured JSON output
function buildStructuredSystemPrompt(): string {
  return `You are an expert PDF summarization assistant. You analyze documents and provide structured, insight-rich outputs in JSON format.

Your response must be a valid JSON object with this exact structure:
{
  "summary": "The main summary text (formatted based on the requested format). It must contain multiple paragraphs that explain context, major findings, implications, and recommended next steps.",
  "keyInsights": [
    {"text": "Key insight 1", "type": "finding|recommendation|warning|statistic|conclusion"},
    {"text": "Key insight 2", "type": "finding|recommendation|warning|statistic|conclusion"}
  ],
  "sections": [
    {"title": "Section Title", "content": "3-5 sentences that synthesize that part of the document"},
    {"title": "Another Section", "content": "More analysis with concrete details"}
  ],
  "suggestedQuestions": [
    "Question 1 that a reader might want to ask about this document?",
    "Question 2 about specific details?"
  ]
}

Insight types:
- "finding": A key discovery or fact from the document
- "recommendation": An action item or suggestion
- "warning": A risk, concern, or caution mentioned
- "statistic": A notable number, percentage, or data point
- "conclusion": A final takeaway or conclusion

Always provide 3-5 key insights, 3-5 richly written sections (infer logical sections when the document does not provide them), and 3-4 suggested questions. Each section description should read like a concise paragraph, not a bullet fragment.`;
}

// Build user prompt for structured output
function buildStructuredUserPrompt(
  text: string,
  format: SummaryFormat,
  length: "short" | "medium" | "detailed"
): string {
  const lengthGuide = {
    short: "200-300 words",
    medium: "500-700 words",
    detailed: "1000-1500 words",
  };

  const formatInstruction = {
    bullet: "Format the summary as clear bullet points with • symbols",
    paragraph: "Format the summary as flowing, professional paragraphs",
    detailed: "Format the summary as a comprehensive section-by-section analysis",
  };

  return `Analyze the following document and provide a structured JSON response.

Summary format: ${formatInstruction[format]}
Summary length: approximately ${lengthGuide[length]}

Document content:
${text}

Remember:
- Extract the most important and actionable insights
- Identify key findings, recommendations, warnings, statistics, and conclusions
- Break down the content into logical sections (each with 3-5 complete sentences)
- Expand slightly beyond a terse recap by explaining why each point matters and how it ties back to the document's goals
- Suggest questions that would help readers understand the document better
- Ensure the summary is accurate to the source material and avoids hallucinations`;
}

interface NormalizedStructuredSummary {
  summary: string;
  keyInsights: KeyInsight[];
  sections: Section[];
  suggestedQuestions: string[];
}

const INSIGHT_TYPES: KeyInsight["type"][] = [
  "finding",
  "recommendation",
  "warning",
  "statistic",
  "conclusion",
];

const INSIGHT_LABELS: Record<KeyInsight["type"], string> = {
  finding: "Finding",
  recommendation: "Recommendation",
  warning: "Risk",
  statistic: "Statistic",
  conclusion: "Conclusion",
};

const SECTION_LABELS: Record<KeyInsight["type"], string> = {
  finding: "Key Findings & Evidence",
  recommendation: "Recommended Actions",
  warning: "Risks & Watchouts",
  statistic: "Notable Metrics",
  conclusion: "Conclusions & Implications",
};

function normalizeStructuredSummary(
  data: StructuredSummary
): NormalizedStructuredSummary {
  const summary = (data.summary || "").trim();

  const keyInsights = Array.isArray(data.keyInsights)
    ? data.keyInsights
        .map((insight) => ({
          text:
            typeof insight.text === "string" ? insight.text.trim() : "",
          type: INSIGHT_TYPES.includes(insight.type)
            ? insight.type
            : ("finding" as const),
        }))
        .filter((insight) => insight.text.length > 0)
    : [];

  let sections = Array.isArray(data.sections)
    ? data.sections
        .map((section: any) => ({
          title:
            typeof section?.title === "string" &&
            section.title.trim().length > 0
              ? section.title.trim()
              : "Section Overview",
          content: formatSectionContent(section?.content),
        }))
        .filter((section) => section.content.length > 0)
    : [];

  const suggestedQuestions = Array.isArray(data.suggestedQuestions)
    ? data.suggestedQuestions
        .map((question) =>
          typeof question === "string" ? question.trim() : ""
        )
        .filter((question) => question.length > 0)
    : [];

  if (sections.length === 0) {
    sections = buildSectionsFromInsights(summary, keyInsights);
  }

  if (sections.length === 0 && summary) {
    sections = [
      {
        title: "Executive Overview",
        content: summary,
      },
    ];
  }

  return {
    summary,
    keyInsights,
    sections,
    suggestedQuestions,
  };
}

function buildReadableSummary(
  data: NormalizedStructuredSummary,
  format: SummaryFormat
): string {
  const chunks: string[] = [];

  if (data.summary) {
    chunks.push("Executive Overview:");
    chunks.push(format === "bullet" ? toBulletList(data.summary) : data.summary);
  }

  if (data.keyInsights.length) {
    const insightsBlock = data.keyInsights
      .map(
        (insight) =>
          `• (${INSIGHT_LABELS[insight.type]}) ${insight.text}`
      )
      .join("\n");
    chunks.push("Key Insights:");
    chunks.push(insightsBlock);
  }

  if (data.sections.length) {
    chunks.push("Section Breakdown:");
    data.sections.forEach((section) => {
      chunks.push(`${section.title}:`);
      chunks.push(section.content);
    });
  }

  if (data.suggestedQuestions.length) {
    chunks.push("Suggested Follow-up Questions:");
    chunks.push(
      data.suggestedQuestions.map((question) => `• ${question}`).join("\n")
    );
  }

  return chunks.join("\n\n").trim();
}

function buildSectionsFromInsights(
  executiveSummary: string,
  insights: KeyInsight[]
): Section[] {
  const grouped: Record<KeyInsight["type"], string[]> = {
    finding: [],
    recommendation: [],
    warning: [],
    statistic: [],
    conclusion: [],
  };

  insights.forEach((insight) => {
    grouped[insight.type].push(insight.text);
  });

  const derived: Section[] = [];
  INSIGHT_TYPES.forEach((type) => {
    if (grouped[type].length > 0) {
      derived.push({
        title: SECTION_LABELS[type],
        content: grouped[type].map((text) => `• ${text}`).join("\n"),
      });
    }
  });

  if (derived.length === 0 && executiveSummary) {
    return [
      {
        title: "Document Overview",
        content: executiveSummary,
      },
    ];
  }

  return derived;
}

function formatSectionContent(rawContent: unknown): string {
  if (typeof rawContent === "string") {
    return rawContent.trim();
  }

  if (Array.isArray(rawContent)) {
    return rawContent
      .map((item) => formatSectionContent(item))
      .filter((text) => text.length > 0)
      .join("\n");
  }

  if (rawContent && typeof rawContent === "object") {
    return Object.values(rawContent)
      .map((value) => formatSectionContent(value))
      .filter((text) => text.length > 0)
      .join("\n");
  }

  return "";
}

function toBulletList(text: string): string {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.startsWith("•") ? line : `• ${line}`))
    .join("\n");
}