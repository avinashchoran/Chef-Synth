export default function IngredientsList(props) {
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))
    let buttonText="Get a recipe";
    if (props.status === "generating") buttonText = "Generating";
    else if (props.status === "done") buttonText = "Generate Again";
    return (
        <section>
            <h2 className="ingredients-title">Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {props.ingredients.length > 3 && <div className="get-recipe-container slide-in-blurred-bottom">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={props.getRecipe} disabled={props.status === "generating"}>{buttonText}</button>
            </div>}
        </section>
    )
}