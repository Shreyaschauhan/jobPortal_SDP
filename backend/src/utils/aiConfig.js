import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const getGeminiOutput = async (prompt, retries = 3) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    const isOverloaded =
      error?.message?.includes("503") ||
      error?.message?.includes("overloaded");

    if (isOverloaded && retries > 0) {
      console.warn(`⚠️ Gemini overloaded. Retrying... (${retries})`);
      await sleep(1500);
      return getGeminiOutput(prompt, retries - 1);
    }

    console.error("Gemini API Error:", error);
    throw new Error(
      "AI service is currently busy. Please try again in a few seconds."
    );
  }
};
