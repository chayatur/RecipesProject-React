import axios from 'axios'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import RecipeStore from '../store/RecipesStore'

const store = new RecipeStore();
const GetRecipes = observer(() => {
    useEffect(() => {
        const axiosRecipes = async () => {
            try {
                const response1 = await axios.get('http://localhost:8080/api/recipe');
                store.recipes = response1.data
            }
            catch {
                console.log("error");
            }
        }
    axiosRecipes();
}, []);
return (
    <div>
{store.recipes.map(recipe=>(
    <div key={recipe.id}>
       
 <p>{recipe.ingredients.join(', ')}</p>
 </div>
))}


    </div>
 )
 })
export default GetRecipes