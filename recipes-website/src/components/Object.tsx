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
