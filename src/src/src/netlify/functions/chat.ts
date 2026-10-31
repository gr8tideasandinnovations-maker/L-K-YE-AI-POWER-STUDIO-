import { GoogleGenAI } from "@google/genai";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 }
    );
  }

  try {
    const { message, language } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Please enter a message." }),
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service is not configured yet." }),
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are LÀÁKÀYÉ AI POWER STUDIO, a helpful multilingual AI assistant. Respond clearly and accurately. If the user requests a language, use it.

Preferred language: ${language || "English"}

User message: ${message}`
    });

    return new Response(
      JSON.stringify({ reply: response.text || "I could not generate a response." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("AI chat error:", error);

    return new Response(
      JSON.stringify({ error: "The AI service could not complete your request. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
