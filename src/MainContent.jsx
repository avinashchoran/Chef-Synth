import { useState } from "react"
import ClaudeRecipe from "./components/ClaudeRecipe"
import IngredientsList from "./components/IngredientsList"
import { getRecipeFromDeepseek } from "./ai"
import GeneratedRecipe from "./components/GenereatedRecipe"
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'


export default function MainContent() {

    const [ingredients, setIngredients] = useState(["Chicken", "Oregano", "Tomatoes"])
    const [recipe, setRecipe] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    async function getRecipe() {
        setIsLoading(true)
        try {
            const recipeMarkdown = await getRecipeFromDeepseek(ingredients)
            setRecipe(recipeMarkdown)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }


    return (
        <main>

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
                    getRecipe={getRecipe} />
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
                : (recipe && <GeneratedRecipe recipe={recipe} />)}

        </main>
    )
}