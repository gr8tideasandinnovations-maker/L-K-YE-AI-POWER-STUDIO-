
import { GoogleGenAI } from "@google/genai";

interface Env {
  GEMINI_API_KEY: string;
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  const jsonHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const { message, language } = await request.json() as {
      message?: string;
      language?: string;
    };

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Please enter a message." }),
        { status: 400, headers: jsonHeaders }
      );
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "AI service is not configured yet."
        }),
        { status: 503, headers: jsonHeaders }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are LÀÁKÀYÈ AI POWER STUDIO,
a helpful multilingual AI assistant.
Respond clearly and accurately.

Preferred language: ${language || "English"}

User message: ${message}`
    });

    return new Response(
      JSON.stringify({
        reply: response.text ||
          "I could not generate a response."
      }),
      { status: 200, headers: jsonHeaders }
    );

  } catch (error) {
    console.error("AI chat error:", error);

    return new Response(
      JSON.stringify({
        error: "The AI service could not complete your request. Please try again."
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
                }
       
