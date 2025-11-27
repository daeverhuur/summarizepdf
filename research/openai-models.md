# OpenAI Model Research for SummarizePDF

Research Date: 2025-11-27
Documentation Source: OpenAI Platform Documentation (platform.openai.com)

## Executive Summary

The user-specified models **gpt-5-nano** and **gpt-5-mini** are **VALID AND CURRENT** OpenAI models. This research confirms their availability and provides detailed specifications for implementation.

## Available GPT-5 Models

OpenAI's GPT-5 series includes reasoning-capable models with configurable reasoning effort:

### 1. GPT-5 nano (gpt-5-nano)
- **Model ID**: `gpt-5-nano` or `gpt-5-nano-2025-08-07` (snapshot)
- **Description**: Fastest, most cost-efficient version of GPT-5
- **Best For**: Summarization and classification tasks (IDEAL FOR PDF SUMMARIZATION)
- **Context Window**: 400,000 tokens
- **Max Output**: 128,000 tokens
- **Reasoning**: Average reasoning capability
- **Speed**: Very fast

### 2. GPT-5 mini (gpt-5-mini)
- **Model ID**: `gpt-5-mini` or `gpt-5-mini-2025-08-07` (snapshot)
- **Description**: A faster, cost-efficient version of GPT-5 for well-defined tasks
- **Best For**: Well-defined tasks with precise prompts (GOOD FALLBACK FOR COMPLEX DOCUMENTS)
- **Context Window**: 400,000 tokens
- **Max Output**: 128,000 tokens
- **Reasoning**: High reasoning capability
- **Speed**: Fast

### 3. GPT-5 (gpt-5)
- **Model ID**: `gpt-5`
- **Description**: Full GPT-5 model with configurable reasoning effort
- **Context Window**: 400,000 tokens
- **Reasoning**: Configurable (low, medium, high)

### 4. GPT-5.1 (gpt-5.1)
- **Model ID**: `gpt-5.1`
- **Description**: Latest intelligent reasoning model for coding and agentic tasks
- **Context Window**: 400,000 tokens
- **Reasoning**: Configurable (none, low, medium, high)

## Pricing Comparison

### GPT-5 nano (RECOMMENDED PRIMARY)
**Per 1M tokens:**
- Input: $0.05
- Cached Input: $0.005
- Output: $0.40

**BEST VALUE FOR HIGH VOLUME**: At 20x cheaper input costs than gpt-5-mini, this is ideal for processing many PDFs.

### GPT-5 mini (RECOMMENDED FALLBACK)
**Per 1M tokens:**
- Input: $0.25
- Cached Input: $0.025
- Output: $2.00

**HIGHER QUALITY**: 5x more expensive but provides better reasoning for complex documents.

### GPT-5 (Reference)
**Per 1M tokens:**
- Input: $1.25
- Cached Input: $0.125
- Output: $10.00

### Pricing Analysis for PDF Summarization

**Example: 50-page PDF (estimated 25,000 tokens)**
- gpt-5-nano: $0.05/1M × 25K = $0.00125 per document
- gpt-5-mini: $0.25/1M × 25K = $0.00625 per document
- Savings: 80% cheaper with gpt-5-nano

**At 1000 documents per month:**
- gpt-5-nano: ~$1.25/month
- gpt-5-mini: ~$6.25/month

## Context Window Specifications

Both models support:
- **Input Context**: 400,000 tokens (massive - can handle very large PDFs)
- **Max Output**: 128,000 tokens
- **Knowledge Cutoff**: May 31, 2024

**PDF Implications:**
- 400K token context = approximately 200-300 pages of dense text
- Far exceeds typical PDF summarization needs
- Enables single-pass processing of large documents

## Modalities and Features

### Supported Inputs
- Text: Yes
- Images: Yes (input only)
- Audio: Not supported
- Video: Not supported

### Supported Features
- Streaming: Yes
- Function Calling: Yes
- Structured Outputs: Yes (JSON schema)
- Fine-tuning: No
- Reasoning Tokens: Yes (can be configured)

### API Endpoints
Both models work with:
- Chat Completions API: `/v1/chat/completions`
- Responses API: `/v1/responses`
- Batch API: `/v1/batch`
- Assistants API: `/v1/assistants`

## Rate Limits

### gpt-5-nano
| Tier | RPM | TPM | Batch Queue Limit |
|------|-----|-----|-------------------|
| Tier 1 | 500 | 200,000 | 2,000,000 |
| Tier 2 | 5,000 | 2,000,000 | 20,000,000 |
| Tier 3 | 5,000 | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | 180,000,000 | 15,000,000,000 |

### gpt-5-mini
| Tier | RPM | TPM | Batch Queue Limit |
|------|-----|-----|-------------------|
| Tier 1 | 500 | 500,000 | 5,000,000 |
| Tier 2 | 5,000 | 2,000,000 | 20,000,000 |
| Tier 3 | 5,000 | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | 180,000,000 | 15,000,000,000 |

## Recommended Implementation

### PRIMARY MODEL: gpt-5-nano
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-5-nano",
  messages: [
    {
      role: "system",
      content: "You are a PDF summarization expert. Provide concise, accurate summaries."
    },
    {
      role: "user",
      content: `Summarize this document: ${pdfContent}`
    }
  ],
  temperature: 0.3, // Lower for more focused summaries
  max_completion_tokens: 1000, // Adjust based on desired summary length
  stream: true // Enable streaming for better UX
});
```

### FALLBACK MODEL: gpt-5-mini
Use when:
- Document is highly technical or complex
- gpt-5-nano produces insufficient quality
- Rate limits reached on gpt-5-nano

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-5-mini",
  messages: [
    {
      role: "system",
      content: "You are a PDF summarization expert. This is a complex document requiring deeper analysis."
    },
    {
      role: "user",
      content: `Provide a detailed summary: ${pdfContent}`
    }
  ],
  temperature: 0.3,
  max_completion_tokens: 2000,
  reasoning_effort: "medium" // Leverage reasoning for complex docs
});
```

## Configuration Parameters

### Recommended Settings for PDF Summarization

```typescript
{
  temperature: 0.3,           // Low for consistency
  max_completion_tokens: 1000, // Adjust per use case
  top_p: 0.9,                  // Slightly focused sampling
  frequency_penalty: 0.3,      // Reduce repetition
  presence_penalty: 0.1,       // Encourage topic coverage
  stream: true,                // Better UX
  reasoning_effort: "medium"   // For gpt-5-mini only (gpt-5-nano defaults to average)
}
```

### Reasoning Effort (GPT-5 series)
- `"none"`: No reasoning (fastest)
- `"minimal"`: Minimal reasoning
- `"low"`: Low reasoning
- `"medium"`: Medium reasoning (default)
- `"high"`: High reasoning (slower, more thoughtful)

Note: gpt-5-nano has "average" reasoning by default and doesn't support custom reasoning effort configuration.

## NPM Package Installation

```bash
npm install openai
```

### Basic Setup
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

### Environment Variable
```
OPENAI_API_KEY=sk-proj-...
```

## Streaming Implementation

```typescript
const stream = await openai.chat.completions.create({
  model: "gpt-5-nano",
  messages: [{ role: "user", content: "Summarize..." }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);
}
```

## Error Handling

```typescript
try {
  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [...]
  });
} catch (error) {
  if (error.status === 429) {
    // Rate limit - retry with exponential backoff or use fallback model
    console.log("Rate limited, switching to gpt-5-mini");
  } else if (error.status === 400) {
    // Bad request - check token count
    console.error("Request error:", error.message);
  } else {
    // Other errors
    console.error("API error:", error);
  }
}
```

## Cost Optimization Strategies

1. **Use gpt-5-nano as default**: 80% cost savings
2. **Enable prompt caching**: $0.005/1M vs $0.05/1M for repeated content
3. **Optimize prompt length**: Shorter system prompts reduce costs
4. **Batch processing**: Use Batch API for non-urgent documents (50% discount)
5. **Smart fallback**: Only use gpt-5-mini when quality issues detected

## Comparison with Other Models

| Model | Input Cost | Context | Speed | Reasoning | Best For |
|-------|-----------|---------|-------|-----------|----------|
| gpt-5-nano | $0.05/1M | 400K | Very Fast | Average | High-volume summarization |
| gpt-5-mini | $0.25/1M | 400K | Fast | High | Complex documents |
| gpt-4o-mini | N/A | 128K | Fast | N/A | Legacy alternative |
| gpt-4o | N/A | 128K | Fast | N/A | Legacy flagship |

## FINAL RECOMMENDATION

### PRIMARY MODEL: gpt-5-nano
**Exact Model ID**: `gpt-5-nano`

**Rationale:**
- Explicitly designed for summarization tasks
- 80% cheaper than gpt-5-mini
- Very fast processing
- 400K token context handles large PDFs
- Sufficient reasoning for most documents

**Best Use Cases:**
- Standard PDF summarization
- High-volume processing
- Real-time summarization
- Cost-sensitive applications

### FALLBACK MODEL: gpt-5-mini
**Exact Model ID**: `gpt-5-mini`

**Rationale:**
- Higher reasoning capability
- Better for complex/technical documents
- Still cost-efficient compared to full GPT-5
- Same 400K token context

**Best Use Cases:**
- Technical papers
- Legal documents
- Academic research
- Documents where gpt-5-nano quality insufficient

## Implementation Checklist

- [x] Models verified: gpt-5-nano and gpt-5-mini exist
- [x] Pricing confirmed: $0.05/1M vs $0.25/1M
- [x] Context windows: 400K tokens both models
- [x] API endpoints: Chat Completions API
- [x] Streaming: Supported
- [x] Rate limits: Documented
- [x] Error handling: Strategies provided
- [x] Cost optimization: Strategies provided

## Additional Resources

- OpenAI Models Documentation: https://platform.openai.com/docs/models
- GPT-5 Usage Guide: https://platform.openai.com/docs/guides/gpt-5
- Chat Completions API: https://platform.openai.com/docs/api-reference/chat
- Pricing Page: https://openai.com/pricing
- Node.js SDK: https://github.com/openai/openai-node

## Notes

- Both models support May 31, 2024 knowledge cutoff
- Reasoning tokens are supported and counted in usage
- Free tier does NOT support these models (Tier 1+ required)
- Prompt caching available for repeated content (90% cost reduction)
- Batch API provides 50% discount for async processing
