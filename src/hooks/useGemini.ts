import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const streamResponse = async (systemInstruction: string, history: any[], onChunk: (chunk: string) => void, imageData?: { data: string, mimeType: string }) => {
    setLoading(true);
    try {
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

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const text = response.text;
      if (!text) return null;
      
      // Clean up markdown if present
      const cleanText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      try {
        return JSON.parse(cleanText);
      } catch (parseError) {
        console.error("JSON Parse Error on text:", cleanText);
        const fixedText = cleanText.replace(/\\(?![bfnrtu"\\\/])/g, '\\\\');
        return JSON.parse(fixedText);
      }
    } catch (error) {
      console.error("Summary Generation Error:", error);
      return null;
    }
  };

  return { streamResponse, generateSummary, loading };
}
