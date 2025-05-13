import { makeAutoObservable } from 'mobx';
import { RecipeInputs } from '../components/Objects';

class RecipeStore {
    [x: string]: any;
    recipes: RecipeInputs[] = [];
    currRecipie: RecipeInputs | null = null;
    currImage: { [key: string]: string } = {};

    constructor() {
        makeAutoObservable(this);
    }

    setCurrImage(imageSrcs: { [key: string]: string }) {
        this.currImage = imageSrcs;
    }

    setCurrRecipie = (rec: RecipeInputs) => {
        this.currRecipie = rec;
    }

    getCurrRecipie = () => {
        return this.currRecipie;
    }

    get recipeDetails() {
        return this.currRecipie ? {
            name: this.currRecipie.Name,
            description: this.currRecipie.Description,
            difficulty: this.currRecipie.Difficulty,
            duration: this.currRecipie.Duration,
            ingredients: this.currRecipie.Ingridents,
            instructions: this.currRecipie.Instructions,
            image: this.currImage[this.currRecipie.Img] || this.currRecipie.Img
        } : null;
    }

    // פונקציה למחיקת מתכון
    deleteRecipe(recipeId: number) {
        this.recipes = this.recipes.filter(recipe => recipe.Id !== recipeId);
    }

    // פונקציה לעריכת מתכון
    editRecipe(updatedRecipe: RecipeInputs) {
        const index = this.recipes.findIndex(recipe => recipe.Id === updatedRecipe.Id);
        if (index !== -1) {
            this.recipes[index] = updatedRecipe;
        }
    }

    // פונקציה לקבלת כל המתכונים
    getShowRecipes() {
        return this.recipes;
    }

    // פונקציה לקבלת מתכון לפי ID
    getRecipeById(recipeId: number) {
        return this.recipes.find(recipe => recipe.Id === recipeId) || null;
    }
}

export default new RecipeStore();
