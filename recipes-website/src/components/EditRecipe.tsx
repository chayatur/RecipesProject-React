
// 5.	עריכת מתכון-(כמובן לא מאפשר לשנות את הID ואת המשתמש שהוסיף אותו)
// http://localhost:8080/api/recipe/edit
// מסוג post
// פרמטרים לשליחה: אובייקט מתכון
//
//  פרמטרים תשובה: אובייקט מתכון מעודכן
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
type Ingredient = {
    name: string;
    count: number;
    type: string;
};

type RecipeInputs = {
    name: string;
    instructions: string[];
    difficulty: string;
    duration: number;
    description: string;
    userId: number;
    categoryId: number;
    img: string;
    ingredients: Ingredient[];
};
const EditRecipe=()=>{

}