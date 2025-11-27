# SummarizePDF Implementation Guide

## Quick Start: OpenAI GPT-5 Integration

### 1. Install Dependencies

```bash
npm install openai
```

### 2. Environment Variables

Add to `.env.local`:
```
OPENAI_API_KEY=sk-proj-your-api-key-here
```

Add to `convex/env.ts` (for Convex actions):
```
OPENAI_API_KEY=sk-proj-your-api-key-here
```

Set in Convex dashboard:
```bash
npx convex env set OPENAI_API_KEY sk-proj-your-api-key-here
```

### 3. Create Convex Action for PDF Summarization

**File**: `convex/ai/summarize.ts`

```typescript
"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizePDF = action({
  args: {
    pdfContent: v.string(),
    useHighQuality: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const model = args.useHighQuality ? "gpt-5-mini" : "gpt-5-nano";

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a PDF summarization expert. Provide concise, accurate summaries that capture the key points and main themes of documents."
          },
          {
            role: "user",
            content: `Summarize the following document:\n\n${args.pdfContent}`
          }
        ],
        temperature: 0.3,
        max_completion_tokens: 1000,
        stream: false,
      });

      const summary = response.choices[0]?.message?.content || "";

      return {
        success: true,
        summary,
        model,
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error: any) {
      // Handle rate limits - fallback to gpt-5-mini
      if (error.status === 429 && model === "gpt-5-nano") {
        console.log("Rate limited on gpt-5-nano, falling back to gpt-5-mini");

        const fallbackResponse = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are a PDF summarization expert. Provide concise, accurate summaries."
            },
            {
              role: "user",
              content: `Summarize the following document:\n\n${args.pdfContent}`
            }
          ],
          temperature: 0.3,
          max_completion_tokens: 1000,
        });

        return {
          success: true,
          summary: fallbackResponse.choices[0]?.message?.content || "",
          model: "gpt-5-mini",
          tokensUsed: fallbackResponse.usage?.total_tokens || 0,
          note: "Fallback model used due to rate limiting",
        };
      }

      return {
        success: false,
        error: error.message || "Unknown error",
      };
    }
  },
});
```

### 4. Create Streaming Version (Better UX)

**File**: `convex/ai/summarizeStream.ts`

```typescript
"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizePDFStream = action({
  args: {
    pdfContent: v.string(),
    useHighQuality: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const model = args.useHighQuality ? "gpt-5-mini" : "gpt-5-nano";

    const stream = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a PDF summarization expert. Provide concise, accurate summaries."
        },
        {
          role: "user",
          content: `Summarize the following document:\n\n${args.pdfContent}`
        }
      ],
      temperature: 0.3,
      max_completion_tokens: 1000,
      stream: true,
    });

    let fullSummary = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullSummary += content;
    }

    return {
      summary: fullSummary,
      model,
    };
  },
});
```

### 5. Frontend Integration (Next.js)

**File**: `app/api/summarize/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { pdfContent, useHighQuality } = await req.json();
  const model = useHighQuality ? "gpt-5-mini" : "gpt-5-nano";

  const stream = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are a PDF summarization expert. Provide concise, accurate summaries."
      },
      {
        role: "user",
        content: `Summarize the following document:\n\n${pdfContent}`
      }
    ],
    temperature: 0.3,
    max_completion_tokens: 1000,
    stream: true,
  });

  // Create a TransformStream to convert OpenAI stream to Response stream
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
```

### 6. React Component

**File**: `components/PDFSummarizer.tsx`

```typescript
"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function PDFSummarizer() {
  const [pdfContent, setPdfContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [useHighQuality, setUseHighQuality] = useState(false);

  const summarize = useAction(api.ai.summarize.summarizePDF);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await summarize({
        pdfContent,
        useHighQuality
      });

      if (result.success) {
        setSummary(result.summary);
        console.log(`Used model: ${result.model}, Tokens: ${result.tokensUsed}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Summarization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useHighQuality}
            onChange={(e) => setUseHighQuality(e.target.checked)}
          />
          <span>Use high-quality mode (gpt-5-mini, 5x more expensive)</span>
        </label>
      </div>

      <textarea
        className="w-full h-64 p-4 border rounded"
        placeholder="Paste PDF content here..."
        value={pdfContent}
        onChange={(e) => setPdfContent(e.target.value)}
      />

      <button
        onClick={handleSummarize}
        disabled={loading || !pdfContent}
        className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Summarizing..." : "Summarize PDF"}
      </button>

      {summary && (
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">Summary:</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}
```

### 7. Streaming Component (Better UX)

**File**: `components/PDFSummarizerStream.tsx`

```typescript
"use client";

import { useState } from "react";

export function PDFSummarizerStream() {
  const [pdfContent, setPdfContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [useHighQuality, setUseHighQuality] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfContent, useHighQuality }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setSummary((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Streaming failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useHighQuality}
            onChange={(e) => setUseHighQuality(e.target.checked)}
          />
          <span>High-quality mode (gpt-5-mini)</span>
        </label>
      </div>

      <textarea
        className="w-full h-64 p-4 border rounded"
        placeholder="Paste PDF content here..."
        value={pdfContent}
        onChange={(e) => setPdfContent(e.target.value)}
      />

      <button
        onClick={handleSummarize}
        disabled={loading || !pdfContent}
        className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Summarizing..." : "Summarize PDF"}
      </button>

      {summary && (
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">Summary:</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}
```

## Model Selection Strategy

### Use gpt-5-nano when:
- Standard PDF documents
- High volume processing
- Cost is a concern
- Real-time summarization needed

### Use gpt-5-mini when:
- Technical or complex documents
- Legal or academic papers
- Quality is critical
- User explicitly requests better quality

## Cost Examples

### Processing 1000 PDFs (avg 25K tokens each)

**With gpt-5-nano:**
- Input: 25M tokens × $0.05/1M = $1.25
- Output: 1M tokens × $0.40/1M = $0.40
- Total: ~$1.65

**With gpt-5-mini:**
- Input: 25M tokens × $0.25/1M = $6.25
- Output: 1M tokens × $2.00/1M = $2.00
- Total: ~$8.25

**Savings: 80% with gpt-5-nano**

## Prompt Optimization

### For Better Summaries

```typescript
const systemPrompt = `You are an expert PDF summarizer. Create summaries that:
1. Capture the main thesis/purpose
2. List key findings or arguments
3. Note important data or statistics
4. Identify conclusions or recommendations
5. Stay concise (200-300 words)`;

const userPrompt = `Summarize this document in the following format:

**Main Purpose**: [1-2 sentences]

**Key Points**:
- [Point 1]
- [Point 2]
- [Point 3]

**Conclusion**: [1-2 sentences]

Document:
${pdfContent}`;
```

## Error Handling Best Practices

```typescript
try {
  const response = await openai.chat.completions.create({...});
} catch (error: any) {
  if (error.status === 429) {
    // Rate limit - wait and retry or use fallback
    console.log("Rate limited, implementing exponential backoff");
    await wait(1000);
    return retryWithFallback();
  } else if (error.status === 400) {
    // Bad request - likely token limit exceeded
    console.log("Token limit exceeded, truncating document");
    return summarizeInChunks(pdfContent);
  } else if (error.status === 401) {
    // Invalid API key
    console.error("Invalid API key");
  } else {
    // Other errors
    console.error("API error:", error.message);
  }
}
```

## Monitoring and Logging

```typescript
export const summarizePDF = action({
  args: { pdfContent: v.string(), useHighQuality: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    const model = args.useHighQuality ? "gpt-5-mini" : "gpt-5-nano";

    const response = await openai.chat.completions.create({...});

    const duration = Date.now() - startTime;
    const tokensUsed = response.usage?.total_tokens || 0;
    const cost = calculateCost(model, response.usage);

    // Log to analytics/monitoring
    console.log({
      model,
      tokensUsed,
      duration,
      cost,
      timestamp: new Date().toISOString(),
    });

    return { summary: response.choices[0].message.content };
  },
});

function calculateCost(model: string, usage: any) {
  const inputTokens = usage?.prompt_tokens || 0;
  const outputTokens = usage?.completion_tokens || 0;

  if (model === "gpt-5-nano") {
    return (inputTokens * 0.05 / 1_000_000) + (outputTokens * 0.40 / 1_000_000);
  } else if (model === "gpt-5-mini") {
    return (inputTokens * 0.25 / 1_000_000) + (outputTokens * 2.00 / 1_000_000);
  }

  return 0;
}
```

## Next Steps

1. Install OpenAI SDK: `npm install openai`
2. Set environment variables
3. Create Convex action with model fallback
4. Build frontend component with streaming
5. Add usage tracking and cost monitoring
6. Deploy and test with real PDFs

## Resources

- OpenAI Node.js SDK: https://github.com/openai/openai-node
- Convex Actions: https://docs.convex.dev/functions/actions
- Next.js Streaming: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming
