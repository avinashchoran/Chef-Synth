import { useState } from "react"
import DemoRecipe from "./DemoRecipe"
import IngredientsList from "./IngredientsList"
import { getRecipeFromDeepseek } from "../ai"
import GeneratedRecipe from "./GenereatedRecipe"
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { API_KEY } from "../config"
import { Toast } from 'primereact/toast';
import { useRef } from "react"


export default function MainContent(props) {
    const toast = useRef(null);
    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [buttonState, setButtonState] = useState("idle")
    const [showDemoRecipe, setShowDemoRecipe] = useState(false)
    async function getRecipe() {
        setIsLoading(true)
        setButtonState("generating")
        try {
            if (!props.apiKey) {
                
                toast.current.show({
                    severity: 'error',
                    summary: 'API Key Missing',
                    detail: 'Please provide a valid API key to generate recipes.',
                    life: 3000,
                    sticky: false
                });;
                setIsLoading(false); 
                setButtonState("idle"); 
                return;
            }
            console.log(props.apiKey)
            const recipeMarkdown = await getRecipeFromDeepseek(ingredients,props.apiKey)
            console.log(recipeMarkdown)
                setRecipe(recipeMarkdown)
                setButtonState("done")

        } catch (err) {
             console.error("Error caught in MainContent:", err); // Log the error for debugging

            // --- Handle errors based on the 'code' property from ai.js ---
            if (err.code === 'RATE_LIMIT_EXCEEDED') {
                toast.current.show({
                    severity: 'warn', // Using 'warn' for a softer alert, as you're providing a fallback
                    summary: 'API Quota Reached',
                    detail: 'It seems the Deepseek API limit has been reached. Here\'s a Demo recipe!',
                    life: 8000, // Show longer for this specific message
                    sticky: true // Make it sticky until dismissed
                });
                setRecipe(""); // Clear any previous Deepseek recipe
                setShowDemoRecipe(true); // Show the ClaudeRecipe component
            } else if (err.code === 'AUTHENTICATION_ERROR') {
                toast.current.show({
                    severity: 'error',
                    summary: 'Authentication Failed',
                    detail: 'Your API key is invalid or unauthorized. Please check your configuration.',
                    life: 7000,
                    sticky: true
                });
                setRecipe("");
                setShowDemoRecipe(true); // Do not show ClaudeRecipe if it's an auth error
            }
            else {
                // Fallback for any other unexpected errors from ai.js
                toast.current.show({
                    severity: 'error',
                    summary: 'Recipe Generation Failed',
                    detail: err.message || 'An unexpected error occurred while fetching the recipe. Please try again.',
                    life: 5000,
                    sticky: true
                });
                setRecipe("");
                setShowDemoRecipe(true); // Do not show ClaudeRecipe for generic errors
            }
            setButtonState("idle");
        } finally {
            setIsLoading(false)
        }
    }
    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        if (newIngredient.trim()) { 
            setIngredients(prevIngredients => [...prevIngredients, newIngredient.trim()]);
        } else {
            toast.current.show({
                severity: 'warn',
                summary: 'Empty Ingredient',
                detail: 'Please enter an ingredient before adding.',
                life: 2000
            });
        }
    }


    return (
        <main>
            <Toast ref={toast} />
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="eg., oregano"
                    aria-label="Add ingredients"
                    name='ingredient'
                />
                <button>Add ingredients</button>
            </form>
            {ingredients.length > 0 &&
                <IngredientsList ingredients={ingredients}
                    getRecipe={getRecipe}
                    status={buttonState} />
            }
            {isLoading ? (

                <div className="loader">
                    <Grid
                        size="100"
                        speed="2.00"
                        color="#d17557"
                    />
                </div>
            )
                : (showDemoRecipe ? (
                    <DemoRecipe /> 
                ) : (
                    recipe && <GeneratedRecipe recipe={recipe} /> 
                )
            )}

        </main>
    )
}