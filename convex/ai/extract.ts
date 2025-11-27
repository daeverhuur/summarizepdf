"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
// @ts-ignore - pdf-parse doesn't have proper ESM types
import pdf from "pdf-parse";

// Extract text from PDF document
export const extractText = action({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    try {
      // Get user identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      // Get document
      const document = await ctx.runQuery(api.documents.get, {
        documentId: args.documentId,
      });

      if (!document) {
        throw new Error("Document not found");
      }

      // Update status to processing
      await ctx.runMutation(internal.documents.updateStatus, {
        documentId: args.documentId,
        status: "processing",
      });

      // Download PDF from Convex storage
      const pdfBlob = await ctx.storage.get(document.storageId);
      if (!pdfBlob) {
        throw new Error("PDF file not found in storage");
      }

      // Convert blob to buffer
      const pdfBuffer = await pdfBlob.arrayBuffer();
      const buffer = Buffer.from(pdfBuffer);

      // Extract text using pdf-parse
      const data = await pdf(buffer, {
        // Extract page-by-page
        pagerender: async (pageData: any) => {
          // This function is called for each page
          return pageData.getTextContent().then((textContent: any) => {
            return textContent.items
              .map((item: any) => item.str)
              .join(" ");
          });
        },
      });

      if (!data || !data.text) {
        throw new Error("No text could be extracted from PDF");
      }

      // Split text by pages
      // pdf-parse doesn't provide page-by-page text by default, so we'll need to
      // estimate based on page breaks or use the numpages info
      const extractedText = await extractPageByPage(buffer);

      if (extractedText.length === 0) {
        throw new Error("PDF appears to be empty or is image-based");
      }

      // Update document with extracted text
      await ctx.runMutation(internal.documents.updateExtractedText, {
        documentId: args.documentId,
        extractedText,
      });

      // Update status to ready
      await ctx.runMutation(internal.documents.updateStatus, {
        documentId: args.documentId,
        status: "ready",
      });

      return {
        success: true,
        pageCount: extractedText.length,
        totalCharacters: extractedText.reduce(
          (sum, page) => sum + page.content.length,
          0
        ),
      };
    } catch (error: any) {
      console.error("Text extraction error:", error);

      // Update status to error
      await ctx.runMutation(internal.documents.updateStatus, {
        documentId: args.documentId,
        status: "error",
      });

      throw new Error(
        `Text extraction failed: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Extract text page by page
async function extractPageByPage(
  buffer: Buffer
): Promise<Array<{ pageNumber: number; content: string }>> {
  const extractedPages: Array<{ pageNumber: number; content: string }> = [];

  try {
    // Parse PDF
    const data = await pdf(buffer);

    // pdf-parse gives us the full text, but we need to split by pages
    // We'll use a simple heuristic: split by common page break patterns
    // This is not perfect but works for most PDFs

    const fullText = data.text;
    const numPages = data.numpages;

    // If we can't detect page breaks, split text evenly
    if (numPages <= 1) {
      extractedPages.push({
        pageNumber: 1,
        content: fullText.trim(),
      });
    } else {
      // Try to split by common page break patterns
      // Many PDFs have form feeds (\f) or multiple newlines between pages
      let pages = fullText.split(/\f+/); // Form feed character

      // If form feed splitting doesn't give us enough pages, try another approach
      if (pages.length < numPages) {
        // Estimate characters per page
        const avgCharsPerPage = Math.ceil(fullText.length / numPages);

        pages = [];
        let currentPos = 0;

        for (let i = 0; i < numPages; i++) {
          const endPos = Math.min(
            currentPos + avgCharsPerPage,
            fullText.length
          );

          // Try to find a paragraph break near the estimated end position
          let actualEndPos = endPos;
          if (i < numPages - 1) {
            // Look for paragraph break within 500 chars of estimated position
            const searchStart = Math.max(0, endPos - 250);
            const searchEnd = Math.min(fullText.length, endPos + 250);
            const searchText = fullText.substring(searchStart, searchEnd);

            const breakMatch = searchText.match(/\n\n+/);
            if (breakMatch && breakMatch.index !== undefined) {
              actualEndPos = searchStart + breakMatch.index;
            }
          } else {
            actualEndPos = fullText.length;
          }

          pages.push(fullText.substring(currentPos, actualEndPos));
          currentPos = actualEndPos;
        }
      }

      // Create page objects
      for (let i = 0; i < pages.length; i++) {
        const content = pages[i].trim();
        if (content.length > 0) {
          extractedPages.push({
            pageNumber: i + 1,
            content,
          });
        }
      }
    }

    return extractedPages;
  } catch (error) {
    console.error("Error in page-by-page extraction:", error);
    throw error;
  }
}

// Fallback: OCR extraction for image-based PDFs
// This would require Tesseract.js or similar, which we can add if needed
// For now, we'll rely on pdf-parse which works for text-based PDFs
export const extractWithOCR = action({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Placeholder for OCR implementation
    // Would use Tesseract.js or similar library
    throw new Error(
      "OCR extraction not yet implemented. This PDF may be image-based. Please use a text-based PDF."
    );
  },
});
