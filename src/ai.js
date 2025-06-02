import { InferenceClient } from "@huggingface/inference";
import { API_KEY } from "./config.js";
console.log(API_KEY);
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`
const client = new InferenceClient(API_KEY);

export async function getRecipeFromDeepseek(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
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
        console.log(err)
    }
}