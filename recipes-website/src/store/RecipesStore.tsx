 type Recipe {
    id: number;
    title: string;
    description: string;
    authorId: number;
    ingredients: string[];
    instructions: string;
    category: string;
    difficulty: string;
    duration: number;

 }
class RecipeStore {
    recipes: Recipe[]; 
    constructor() {
        this.recipes = []; 
    }

   
}
export default RecipeStore

