import ReactMarkdown from "react-markdown"
export default function GeneratedRecipe(props) {
    return (
        <section className="suggested-recipe-container text-focus-in">
           <h2>Chef Synth Recommends: </h2>

                <ReactMarkdown>{props.recipe}</ReactMarkdown>

            </section>
    )
}