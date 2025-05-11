export type Ingredient = {
    Name: string;
    Count: number;
    Type: string;
};

export type RecipeInputs = {
    Id: number,
    Name: string;
    Instructions: string[];
    Difficulty: 'low' | 'medium' | 'high';
    Duration: number;
    Img: string;
    Ingredients: Ingredient[];
    UserId: number;
    CategoryId: number;
    Description: string;
};

export type User = {
    Id: number;
    UserName: string;
    Password: string;
    Name: string;
    Phone: string;
    Tz: string;
};

export type Categories = {
    Id: number;
    Name: string;
};
