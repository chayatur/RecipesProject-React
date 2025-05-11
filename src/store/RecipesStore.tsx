import { RecipeInputs } from "../components/Object";
import { makeAutoObservable } from "mobx";

class RecipeStore {
    recipes: RecipeInputs[];

    constructor() {
        this.recipes = [];
        makeAutoObservable(this);
    }

    getShowRecipes() {
        return this.recipes;
    }
}

export default new RecipeStore();
