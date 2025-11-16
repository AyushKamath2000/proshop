import {GoogleGenAI} from "@google/genai";

export default async function generateStructuredReview(productName) {
    const reviewSchema = {
        "type": "object",
        "properties": {
            "product_name": { "type": "string" },
            "product_description": { "type": "string" },
            "pros": {
                "type": "Array",
                "items": { "type": "string" }
            },
            "cons": {
                "type": "Array",
                "items": { "type": "string" }
            },
            "rating": {
                "type": "number",
                "minimum": 1,
                "maximum": 5
            }
        },
        "required": [
            "product_name",
            "product_description",
            "pros",
            "cons",
            "rating"
        ]
    };
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; 
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Analyze the following product .
        Review: "${productName}"
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: prompt,

        config : {
            responseMimeType: "application/json",
            responseSchema: reviewSchema
        }
    });

    return response.text;
}
