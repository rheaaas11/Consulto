import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Helper for exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 10, delay = 5000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Check if error is a 429 (Resource Exhausted)
    const isRateLimit = error.message && error.message.includes("429");
    if (isRateLimit && retries > 0) {
      // Add jitter: delay * (0.5 to 1.5)
      const jitter = 0.5 + Math.random();
      const backoffDelay = Math.floor(delay * jitter);
      console.warn(`Rate limited, retrying in ${backoffDelay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const streamResponse = async (systemInstruction: string, history: any[], onChunk: (chunk: string) => void, imageData?: { data: string, mimeType: string }) => {
    setLoading(true);
    try {
      const ai = getAiClient();
      const lastMessage = history[history.length - 1].content;
      const previousMessages = history.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const parts: any[] = [{ text: lastMessage }];
      if (imageData) {
        parts.push({
          inlineData: {
            data: imageData.data,
            mimeType: imageData.mimeType
          }
        });
      }

      const contents = [...previousMessages, { role: 'user', parts }];

      const response = await retryWithBackoff(() => ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      }));

      let fullText = "";
      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onChunk(text);
        }
      }
      return fullText;
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      return "Error streaming response. Please check your connection.";
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (prompt: string) => {
    try {
      const ai = getAiClient();
      const responseSchema = {
        type: "OBJECT",
        properties: {
          strengths: { type: "ARRAY", items: { type: "STRING" } },
          areasToRevisit: { type: "ARRAY", items: { type: "STRING" } },
          misconceptions: { type: "ARRAY", items: { type: "STRING" } },
          overallReadiness: { type: "INTEGER", description: "0 to 100 as an integer" },
          practiceQuestions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                hint: { type: "STRING" },
                source: { type: "STRING" }
              },
              required: ["question", "hint", "source"]
            }
          },
          externalResources: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                url: { type: "STRING" },
                type: { type: "STRING", enum: ["video", "article", "website"] },
                description: { type: "STRING" }
              },
              required: ["title", "url", "type", "description"]
            }
          }
        },
        required: ["strengths", "areasToRevisit", "misconceptions", "overallReadiness", "practiceQuestions", "externalResources"]
      };

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      }));

      const text = response.text;
      if (!text) {
        console.error("Gemini returned empty text for summary generation");
        return null;
      }
      
      // Clean up markdown if present
      const cleanText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      try {
        return JSON.parse(cleanText);
      } catch (parseError) {
        console.error("JSON Parse Error on text:", cleanText);
        console.error("Original text:", text);
        const fixedText = cleanText.replace(/\\(?![bfnrtu"\\\/])/g, '\\\\');
        try {
          return JSON.parse(fixedText);
        } catch (secondParseError) {
          console.error("Second JSON Parse Error on text:", fixedText);
          return null;
        }
      }
    } catch (error) {
      console.error("Summary Generation Error:", error);
      return null;
    }
  };

  return { streamResponse, generateSummary, loading };
}
