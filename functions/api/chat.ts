
interface Env {
  GEMINI_API_KEY: string;
}

const allowedDepartments = [
  "AI Assistant",
  "AI Coding Studio",
  "Academic Centre",
  "Business Intelligence",
  "Language Centre",
  "Creative Studio",
];
const departmentInstructions: Record<string, string> = {
  "AI Assistant":
    "You are the general-purpose AI Assistant. Help users with questions, explanations, planning and everyday tasks.",

  "AI Coding Studio":
    "You are a specialist software development assistant. Help with programming, debugging, web development, app development and technical explanations. Provide accurate, secure and maintainable code.",

  "Academic Centre":
    "You are an academic learning specialist. Explain difficult topics clearly, support research, mathematics, science and learning. Encourage understanding and academic integrity.",

  "Business Intelligence":
    "You are a business intelligence specialist. Help with business strategy, market research, financial analysis, planning, data interpretation and informed business decisions.",

  "Language Centre":
    "You are a multilingual language specialist. Help with translation, grammar, language learning and communication in the user's preferred language.",

  "Creative Studio":
    "You are a creative specialist. Help with writing, storytelling, content creation, brainstorming, branding and creative ideas."
};
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
  department?: string;
  autoMode?: boolean;
};

const { message, language, department, autoMode } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
    JSON.stringify({ error: "Please enter a message." }),
    { status: 400, headers }
  );
}
if (
  department &&
  !allowedDepartments.includes(department)
) {
    return new Response(
    JSON.stringify({ error: "Invalid department selected." }),
    { status: 400, headers }
  );
}    
if (
  autoMode !== undefined &&
  typeof autoMode !== "boolean"
) {
  return new Response(
    JSON.stringify({
      error: "Invalid Auto Mode setting."
    }),
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

// LÀÁKÀYÈ CENTRAL AGENT MANAGER
let selectedDepartment: string = "AI Assistant";

if (autoMode === true) {
  const routingPrompt = `
You are the LÀÁKÀYÈ Central Agent Manager.

Choose exactly ONE best specialist for the user's request.

Available departments:

1. AI Assistant: General questions, explanations and everyday tasks.
2. AI Coding Studio: Programming, debugging and software development.
3. Academic Centre: Education, research, mathematics and science.
4. Business Intelligence: Business strategy, market research and financial analysis.
5. Language Centre: Translation, grammar and language learning.
6. Creative Studio: Writing, storytelling, branding and creative ideas.

Rules:
- Select the single most appropriate department.
- Choose AI Assistant for general or unclear requests.
- Do not invent department names.
- Return only the exact department name.
- Do not answer the user's question.

User language: ${language || "English"}

User request: ${message}
`;

  const routingResponse = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: routingPrompt }]
          }
        ]
      })
    }
  );

  if (!routingResponse.ok) {
    console.error("Agent Manager routing failed:", routingResponse.status);

    return new Response(
      JSON.stringify({
        error: "Automatic department selection failed. Please try again."
      }),
      { status: 502, headers }
    );
  }

  const routingData = await routingResponse.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const routingResult = routingData.candidates
    ?.flatMap(candidate => candidate.content?.parts || [])
    .map(part => part.text || "")
    .join("")
    .trim();

  const matchedDepartment = allowedDepartments.find(
    item => item === routingResult
  );

  if (!matchedDepartment) {
    return new Response(
      JSON.stringify({
        error: "The Agent Manager returned an invalid department. Please try again."
      }),
      { status: 502, headers }
    );
  }

  selectedDepartment = matchedDepartment;

} else {
  selectedDepartment = department || "AI Assistant";
        }
    
  // Prepare Gemini request


const specialistInstruction =
  departmentInstructions[selectedDepartment];

const prompt = `You are LÀÁKÀYÈ AI POWER STUDIO.

Your active department is: ${selectedDepartment}.

Specialist instructions:
${specialistInstruction}

Respond clearly, accurately and helpfully.

Preferred language: ${language || "English"}

User message: ${message}`;

// Call Gemini with automatic retries
const retryableStatuses = [429, 500, 502, 503, 504];

let geminiResponse: Response;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
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

    if (
      geminiResponse.ok ||
      !retryableStatuses.includes(geminiResponse.status) ||
      attempt === 3
    ) {
      break;
    }
  } catch (error) {
    if (attempt === 3) {
      throw error;
    }
  }

  await new Promise(resolve =>
    setTimeout(resolve, attempt * 1000)
  );
}
  

   
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
  } catch (error) {
    console.error("LAAKAYE AI Function exception:", error);

    return new Response(
      JSON.stringify({
        error: "The AI service encountered an error. Please try again."
      }),
      { status: 500, headers }
    );
  }
}
