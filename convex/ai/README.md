# AI Features Implementation

This directory contains OpenAI-powered AI features for SummarizePDF.

## Models Used

Based on research from `/research/openai-models.md`:

- **Primary Model**: `gpt-5-nano` ($0.05/1M input tokens)
  - Cost-effective for high-volume summarization
  - 400K token context window
  - Average reasoning capability

- **Fallback Model**: `gpt-5-mini` ($0.25/1M input tokens)
  - Higher quality for complex documents
  - 400K token context window
  - High reasoning capability
  - Used when primary model hits rate limits

## Features

### 1. PDF Summarization (`summarize.ts`)

Generate AI summaries of PDF documents with customizable format and length.

**Action**: `api.ai.summarize.generateSummary`

**Arguments**:
- `documentId`: ID of the document to summarize
- `format`: "bullet" | "paragraph" | "detailed"
- `length`: "short" (200-300 words) | "medium" (500-700 words) | "detailed" (1000-1500 words)

**Features**:
- Checks usage limits before processing
- Extracts and combines text from all pages
- Uses format-specific prompts for optimal results
- Automatic fallback to gpt-5-mini on rate limits
- Saves summary to database with token usage tracking
- Increments usage counters

**Format Examples**:
- **Bullet**: Organized bullet points with clear headings
- **Paragraph**: Executive summary style with flowing prose
- **Detailed**: Section-by-section comprehensive analysis

### 2. Chat with PDF (`chat.ts`)

Interactive Q&A with PDF documents using AI.

**Action**: `api.ai.chat.chatWithDocument`

**Arguments**:
- `documentId`: ID of the document to chat about
- `userMessage`: User's question

**Features**:
- Checks tier limits (free users can't chat)
- Maintains chat history context (last 10 messages)
- Answers ONLY based on document content
- Extracts and includes page references in responses
- Saves both user and AI messages to database
- Increments question usage counter

**Capabilities**:
- Answer questions about document content
- Quote specific sections with page references
- Clarify when information is not in the document
- Maintain conversation context

### 3. Text Extraction (`extract.ts`)

Extract text from PDF files using pdf-parse.

**Action**: `api.ai.extract.extractText`

**Arguments**:
- `documentId`: ID of the document to process

**Features**:
- Downloads PDF from Convex storage
- Extracts text using pdf-parse library
- Splits text by pages (with intelligent page detection)
- Handles multi-page documents
- Updates document status (processing → ready/error)
- Stores extracted text in database

**Page Detection**:
- Detects form feed characters (\f)
- Falls back to estimated page splits for PDFs without page breaks
- Finds natural paragraph breaks for cleaner splits

## Usage Limits Enforcement

All AI operations check tier limits before processing:

| Tier | Docs/Day | Max Pages | Chat Questions |
|------|----------|-----------|----------------|
| Free | 3 | 20 | 0 (no chat) |
| Starter | 25 | 100 | 10/document |
| Pro | Unlimited | 500 | Unlimited |
| Team | Unlimited | 500 | Unlimited |

Usage is tracked and incremented after successful operations.

## Configuration

All configuration is in `models.ts`:

```typescript
OPENAI_MODELS.PRIMARY    // gpt-5-nano
OPENAI_MODELS.FALLBACK   // gpt-5-mini

MODEL_CONFIG.temperature         // 0.3
MODEL_CONFIG.maxTokens.short     // 500
MODEL_CONFIG.maxTokens.medium    // 1000
MODEL_CONFIG.maxTokens.detailed  // 2000
```

## Environment Variables

Required in Convex dashboard:

```bash
OPENAI_API_KEY=sk-proj-...
```

Set via:
```bash
npx convex env set OPENAI_API_KEY="your-key-here"
```

## Error Handling

All actions include comprehensive error handling:

- Authentication errors
- Document not found errors
- Usage limit errors
- API rate limit errors (with fallback)
- Text extraction errors
- Status updates on failures

## Dependencies

- `openai`: ^4.77.3 (OpenAI Node.js SDK)
- `pdf-parse`: ^2.4.5 (PDF text extraction)

## Cost Optimization

1. **Primary model first**: 80% cost savings with gpt-5-nano
2. **Smart fallback**: Only use gpt-5-mini when needed
3. **Optimized prompts**: Concise system prompts reduce token usage
4. **Token limits**: Control output length by summary type
5. **Usage tracking**: Monitor and enforce limits per tier

## Future Enhancements

Potential additions:

- [ ] OCR support for image-based PDFs (Tesseract.js)
- [ ] Batch processing for multiple documents
- [ ] Streaming responses for real-time updates
- [ ] Custom model selection per user tier
- [ ] Prompt caching for repeated content (90% cost reduction)
