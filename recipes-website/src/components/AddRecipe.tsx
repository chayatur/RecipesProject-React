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

const isUserRegistered = async (userId: number): Promise<boolean> => {
    try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        return response.status === 200;
    } catch (error) {
        return false; 
    }
};

const AddRecipe = observer(() => {
    const { register, handleSubmit, formState: { errors } } = useForm<RecipeInputs>();
    
    const onSubmit: SubmitHandler<RecipeInputs> = async (data) => {
        const userRegistered = await isUserRegistered(data.userId);
        
        if (!userRegistered) {
            console.error('User is not registered.');
            return; 
        }

        try {
            const response = await axios.post('http://localhost:8080/api/recipe', data);
            console.log('Recipe saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Name" {...register("name", { required: true })} />
                {errors.name && <span>This field is required</span>}

                <textarea placeholder="Instructions" {...register("instructions")} />
                {errors.instructions && <span>This field is required</span>}

                <input placeholder="Difficulty" {...register("difficulty", { required: true })} />
                {errors.difficulty && <span>This field is required</span>}

                <input type="number" placeholder="Duration" {...register("duration", { valueAsNumber: true, required: true })} />
                {errors.duration && <span>This field is required</span>}

                <input placeholder="Description" {...register("description", { required: true })} />
                {errors.description && <span>This field is required</span>}

                <input type="number" placeholder="User ID" {...register("userId", { valueAsNumber: true, required: true })} />
                {errors.userId && <span>This field is required</span>}

                <input type="number" placeholder="Category ID" {...register("categoryId", { valueAsNumber: true, required: true })} />
                {errors.categoryId && <span>This field is required</span>}

                <input placeholder="Image URL" {...register("img")} />

                <h3>Ingredients</h3>
                <input placeholder="Ingredient Name" {...register("ingredients.0.name")} />
                <input type="number" placeholder="Count" {...register("ingredients.0.count")} />
                <input placeholder="Type" {...register("ingredients.0.type")} />

                <input type="submit" />
            </form>
        </div>
    );
});

export default AddRecipe;
