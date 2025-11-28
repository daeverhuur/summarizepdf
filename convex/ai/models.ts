// OpenAI Model Configuration for SummarizePDF
// Using GPT-4o models for summarization

export const OPENAI_MODELS = {
  // PRIMARY: Cost-effective model for high-volume summarization
  // gpt-4o-mini: Fast, affordable, 128K context window
  PRIMARY: "gpt-4o-mini",

  // FALLBACK: Higher quality model for complex documents
  // gpt-4o: Most capable GPT-4 model, 128K context window
  FALLBACK: "gpt-4o",
} as const;

// Model configuration settings
export const MODEL_CONFIG = {
  // Temperature: Lower for more focused, consistent summaries
  temperature: 0.3,

  // Top P: Slightly focused sampling
  top_p: 0.9,

  // Frequency penalty: Reduce repetition
  frequency_penalty: 0.3,

  // Presence penalty: Encourage topic coverage
  presence_penalty: 0.1,

  // Token limits based on summary length
  maxTokens: {
    short: 500,      // 200-300 words
    medium: 1000,    // 500-700 words
    detailed: 2000,  // 1000-1500 words
  },
} as const;

// Chunk size for large documents (to stay within context window)
export const CHUNK_SIZE = 100000; // ~50,000 words
export const CHUNK_OVERLAP = 2000; // 200 token overlap for context continuity
