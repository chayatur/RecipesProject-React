export type Ingredient = {
    Name: string;
    Count: number;
    Type: string;
}; 
// export enum Difficulty {
//     Low = 1,
//     Medium = 2,
//     High = 3,
// }
export type RecipeInputs = {
    Id: number,
    Name: string;
    Description: string;
    UserId: number;
    Categoryid: number;
    Img: string; 
    Duration: number;
    Difficulty: number
    Ingridents : Ingredient[];
    Instructions :[{Name:""}],
};
export interface Instruction {
    Name: string;
    RecipeId?: number;
}
export type User = {
    Id: number;
    UserName: string;
    Password: string;
    Name: string;
    Phone: string;
    Email:string;
    Tz: string;
};

export type Categories = {
    Id: number;
    Name: string;
};

