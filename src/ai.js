import { InferenceClient } from "@huggingface/inference";
// import { API_KEY } from "./config.js";
// console.log(API_KEY); 
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`


export async function getRecipeFromDeepseek(ingredientsArr,API_KEY) {
    const ingredientsString = ingredientsArr.join(", ")
    const client = new InferenceClient(API_KEY);
    try {
        const chatCompletion = await client.chatCompletion({
            provider: "nscale",
            model: "Qwen/Qwen2.5-Coder-32B-Instruct",
            messages: [
                {
                    role: "user",
                    content: SYSTEM_PROMPT + `I have ${ingredientsString}. Please give me a recipe you would recommend I make!`,
                },
            ],
        });
        console.log(chatCompletion.choices[0].message.content);
        return (chatCompletion.choices[0].message.content)
    }
    catch (err) {
        console.error("Error from Hugging Face Inference API:", err);

        // Check if it's an HfInferenceError and has a specific status code
        if (err.name === 'HfInferenceError' && err.statusCode) {
            if (err.statusCode === 429) { // HTTP 429 Too Many Requests (Common for rate limits/quotas)
                const customError = new Error(err.message || 'API rate limit or quota exceeded. Please try again later.');
                customError.code = 'RATE_LIMIT_EXCEEDED';
                throw customError;
            } else if (err.statusCode === 401 || err.statusCode === 403) { // Unauthorized or Forbidden (e.g., invalid API key)
                const customError = new Error(err.message || 'Authentication failed. Please check your API key.');
                customError.code = 'AUTHENTICATION_ERROR';
                throw customError;
            } else {
                // For other HfInferenceError types, re-throw with a generic code
                const customError = new Error(err.message || `API error with status code ${err.statusCode}.`);
                customError.code = 'API_ERROR';
                throw customError;
            }
        } else {
            // For non-HfInferenceError or unexpected errors, re-throw a generic error
            const customError = new Error(err.message || 'An unknown error occurred during API call.');
            customError.code = 'UNKNOWN_ERROR';
            throw customError;
        }
    }
}
