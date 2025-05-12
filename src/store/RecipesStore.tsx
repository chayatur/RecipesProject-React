import { RecipeInputs } from "../components/Objects";
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
