import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * POST /v1/chatbot/chat
 * Body: { userQuery: string }
 */
const chatbot = asyncHandler(async (req, res) => {
    const { userQuery } = req.body;

    /* -------------------- 1. Validate input -------------------- */
    if (!userQuery || typeof userQuery !== "string") {
        throw new ApiError(400, "userQuery is required and must be a string");
    }

    const normalizedQuery = userQuery.toLowerCase();

    /* -------------------- 2. Topic filtering -------------------- */
    const allowedTopics = [
        "job",
        "application",
        "resume",
        "cv",
        "cover letter",
        "interview",
        "vacancy",
        "career",
        "skills",
        "salary",
        "hiring",
        "placement",
        "react",
        "mern",
        "developer",
        "software"
    ];

    const isRelevant = allowedTopics.some(topic =>
        normalizedQuery.includes(topic)
    );

    // ❗ Better UX: guide instead of blocking
    if (!isRelevant) {
        return res.status(200).json(
            new ApiResponse(
                200,
                "I specialize in job, resume, interview, and tech-career related questions. Please ask something related 😊",
                "Out of scope"
            )
        );
    }

    /* -------------------- 3. Segmind API config -------------------- */
    const apiKey = process.env.SEGMIND_API_KEY; // ✅ NEVER hardcode keys
    const url = "https://api.segmind.com/v1/llama-v3-8b-instruct";

    if (!apiKey) {
        throw new ApiError(500, "Segmind API key not configured");
    }

    const payload = {
        messages: [
            {
                role: "user",
                content: userQuery
            }
        ]
    };

    /* -------------------- 4. API Call -------------------- */
    let response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        throw new ApiError(500, "Failed to reach AI service");
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
            response.status,
            `AI API Error: ${errorText}`
        );
    }

    const responseData = await response.json();

    /* -------------------- 5. Safe response parsing -------------------- */
    const chatbotReply =
        responseData?.choices?.[0]?.message?.content ??
        "Sorry, I couldn't generate a response.";

    return res.status(200).json(
        new ApiResponse(200, chatbotReply, "Chat response generated")
    );
});

export { chatbot };
