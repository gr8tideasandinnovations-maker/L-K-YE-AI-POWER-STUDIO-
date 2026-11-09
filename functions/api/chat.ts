
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
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Check the request
    const body = await request.json() as {
      message?: string;
      language?: string;
    };

    const { message, language } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Please enter a message." }),
        { status: 400, headers }
      );
    }

    // Check API configuration
    if (!env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing.");

      return new Response(
        JSON.stringify({
          error: "AI service is not configured yet."
        }),
        { status: 503, headers }
      );
    }

    // Prepare Gemini request
    const prompt = `You are LÀÁKÀYÈ AI POWER STUDIO,
a helpful multilingual AI assistant.
Respond clearly, accurately and helpfully.

Preferred language: ${language || "English"}

User message: ${message}`;

    // Call Gemini directly using native fetch
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

   
    // Read Google's response
    const data = await geminiResponse.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
      error?: {
        message?: string;
        status?: string;
      };
    };

    // Handle errors returned by Google
    if (!geminiResponse.ok) {
      console.error("Gemini API error:", {
        status: geminiResponse.status,
        message: data.error?.message || "Unknown Gemini API error",
        code: data.error?.status || "UNKNOWN"
      });

      return new Response(
        JSON.stringify({
          error: `Gemini request failed. Provider HTTP status: ${geminiResponse.status}`,
          providerStatus: geminiResponse.status
        }),
        { status: 502, headers }
      );
    }

    // Extract generated text
    const reply = data.candidates
      ?.flatMap(candidate => candidate.content?.parts || [])
      .map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error("Gemini returned no text response.");

      return new Response(
        JSON.stringify({
          error: "The AI returned an empty response. Please try again."
        }),
        { status: 502, headers }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers }
    );

  

      
