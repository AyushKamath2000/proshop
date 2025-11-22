import { GoogleGenAI } from "@google/genai";

export default async function generateReviewSummaryFromReviews(reviews) {
    const summarySchema = {
        type: "object",
        properties: {
            review_summary: { type: "string" }
        },
        required: ["review_summary"]
    };

    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Flatten reviews into readable text for AI
    const formattedReviews = reviews
        .map(r => `- Rating: ${r.rating}, Comment: ${r.comment}`)
        .join("\n");

    const prompt = `
      Summarize the following customer reviews into EXACTLY TWO LINES.
      Be neutral, clear, and concise. Do not add anything extra.

      Reviews:
      ${formattedReviews}
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: summarySchema
        }
    });
    // console.log(response.text[0]);
    return JSON.parse(response.text);
}
