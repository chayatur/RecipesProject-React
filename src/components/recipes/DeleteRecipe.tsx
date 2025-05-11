            

import  { useEffect } from 'react';
// import { observer } from 'mobx-react';
import RecipeStore from '../../store/RecipeStore';
import { Box, Typography, CircularProgress, Alert, ListItem, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const RecipeList =() => {
    useEffect(() => {
        RecipeStore.fetchRecipes();
    }, []);
    return (
        <Box>
            {RecipeStore.recipes.map(recipe => (
                <ListItem key={recipe.Id}>
                    <Typography>{recipe.CategoryId}</Typography>
                    <IconButton onClick={() => RecipeStore.deleteRecipe(recipe.Id)}>
                        <Delete />
                    </IconButton>
                </ListItem>
            ))}
        </Box>
    );
};

export default RecipeList;
