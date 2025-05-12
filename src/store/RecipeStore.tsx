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
            name: this.currRecipie.name,
            description: this.currRecipie.description,
            difficulty: this.currRecipie.difficulty,
            duration: this.currRecipie.duration,
            ingredients: this.currRecipie.ingredients,
            instructions: this.currRecipie.instructions,
            image: this.currImage[this.currRecipie.img] || this.currRecipie.img
        } : null;
    }

    // פונקציה למחיקת מתכון
    deleteRecipe(recipeId: number) {
        this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
    }

    // פונקציה לעריכת מתכון
    editRecipe(updatedRecipe: RecipeInputs) {
        const index = this.recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
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
        return this.recipes.find(recipe => recipe.id === recipeId) || null;
    }
}

export default new RecipeStore();
