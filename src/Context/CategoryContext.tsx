import axios from "axios";
import { createContext, ReactElement, useEffect, useState } from "react";

// הגדרת סוג של קטגוריות
type CatContextType = {
  categories: Array<{ Id: number; Name: string }> | null; 
  setCategories: (categories: Array<{ Id: number; Name: string }>) => void;
};

// יצירת קונטקסט
export const CatContext = createContext<CatContextType>({
  categories: null,
  setCategories: () => {},
});

const CategoryContext = ({ children }: { children: ReactElement }) => {
  const [categories, setCategories] = useState<Array<{ Id: number; Name: string }> | null>(null);

  // פונקציה לעדכון הקטגוריות
  const updateCategories = (cats: Array<{ Id: number; Name: string }>) => {
    setCategories(cats);
  };
  
  // פונקציה לקבלת קטגוריות מה-API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/category");
      updateCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CatContext.Provider value={{ categories, setCategories: updateCategories }}>
      {children}
    </CatContext.Provider>
  );
};

export default CategoryContext;
