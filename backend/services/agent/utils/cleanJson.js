/**
 * Robust JSON extraction utility for LLM responses.
 * Handles markdown fences, extraneous text, and trailing characters.
 */
export const extractJson = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Cannot parse empty or non-string LLM response as JSON");
  }

  let cleaned = text.trim();

  // Strip codeblock markdown syntax ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  // If there's still preamble or trailing text, find the outermost { and }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Second pass attempt: replace unescaped control characters
    try {
      const sanitized = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      return JSON.parse(sanitized);
    } catch (secondErr) {
      console.error("extractJson failure on raw input:\n", text);
      throw new Error(`Failed to parse LLM response into valid JSON: ${err.message}`);
    }
  }
};
