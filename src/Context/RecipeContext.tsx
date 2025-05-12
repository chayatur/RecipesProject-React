import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { RecipeInputs } from '../components/Objects';

// הגדר את סוג הקונטקסט
interface RecipeContextType {
  recipes: RecipeInputs[];
  fetchRecipes: () => Promise<void>;
  updateRecipe: (id: number, updatedData: RecipeInputs) => Promise<void>;
}

// צור את הקונטקסט
export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// ספק את הקונטקסט
export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<RecipeInputs[]>([]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get<RecipeInputs[]>('http://localhost:8080/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error("שגיאה בעת טעינת המתכונים:", error);
    }
  };

  const updateRecipe = async (id: number, updatedData: RecipeInputs) => {
    try {
      const response = await axios.put<RecipeInputs>(`http://localhost:8080/api/recipes/${id}`, updatedData);
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => (recipe.UserId === id ? response.data : recipe))
      );
    } catch (error) {
      console.error("שגיאה בעדכון המתכון:", error);
    }
  };

  return (
    <RecipeContext.Provider value={{ recipes, fetchRecipes, updateRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
