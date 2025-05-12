import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Container, TextField, Button, Typography, Snackbar, Paper, MenuItem } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Difficulty } from '../Objects';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditRecipe = observer(() => {
  const nav = useNavigate();
  const { id } = useParams();
  const { control, handleSubmit, setValue } = useForm();
  const { fields: ingredientFields, append: addIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients"
  });
  const { fields: instructionFields, append: addInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: "instructions"
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        const recipeData = response.data;

        // Set the form values with the fetched data
        setValue("name", recipeData.Name);
        setValue("description", recipeData.Description);
        setValue("difficulty", recipeData.Difficulty);
        setValue("duration", recipeData.Duration);
        setValue("CategoryId", recipeData.CategoryId);
        setValue("img", recipeData.Img);
        
        // Set ingredients and instructions
        recipeData.Ingridents.forEach((ingredient :any)=> {
          addIngredient({ name: ingredient.Name, count: ingredient.Count, type: ingredient.Type });
        });
        recipeData.Instructions.forEach( (instruction:any)=> {
          addInstruction(instruction.Name);
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/category");
        setCategories(res.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchRecipe();
    fetchCategories();
  }, [id, setValue, addIngredient, addInstruction]);

  const onSubmit = async (data:any) => {
    try {
        const payload = {
            Id: id, // הוספת ה-ID של המתכון
            Name: data.name,
            Description: data.description,
            Difficulty: data.difficulty === 'low' ? 1 : data.difficulty === 'medium' ? 2 : 3,
            Duration: Number(data.duration),
            Img: data.img,
            CategoryId: Number(data.CategoryId), // הוספת קטגוריה
            Ingredients: data.ingredients.map((ingredient:any) => ({
                Name: ingredient.name,
                Count: Number(ingredient.count),
                Type: ingredient.type,
            })),
            Instructions: data.instructions.map((instruction: any) => ({
                Name: instruction,
            })),
        };

        await axios.post(`http://localhost:8080/api/recipe/edit`, payload);
        setSnackbarMessage('המתכון עודכן בהצלחה!');
        setSnackbarSeverity('success');
    } catch (error:any) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        setSnackbarMessage('שגיאה בעדכון המתכון. אנא נסה שוב.');
        setSnackbarSeverity('error');
    } finally {
        setSnackbarOpen(true);
        nav(`/ShowRecipes/ShowRecipe/${data.name}`);
    }
};


  return (
    <Box sx={{ minHeight: "100vh", opacity: "90%", py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, opacity: "80%", width: "75%", margin: "0 auto" }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#d35400' }}>
            <KitchenIcon sx={{ mr: 1 }} /> עריכת מתכון
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField label="שם המתכון" required {...field} fullWidth sx={{ mb: 2 }} />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField label="תיאור" required {...field} fullWidth multiline rows={3} sx={{ mb: 2 }} />
              )}
            />
            <Controller
              name="difficulty"
              control={control}
              defaultValue="low"
              render={({ field }) => (
                <TextField select label="דרגת קושי" required {...field} fullWidth sx={{ mb: 2 }}>
                  <MenuItem value="low">קל</MenuItem>
                  <MenuItem value="medium">בינוני</MenuItem>
                  <MenuItem value="high">קשה</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="duration"
              control={control}
              defaultValue={30}
              render={({ field }) => (
                <TextField label="משך זמן הכנה (דקות)" type="number" required {...field} fullWidth sx={{ mb: 2 }} inputProps={{ min: 1 }} />
              )}
            />
            <Controller
              name="CategoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="קטגוריה"
                  fullWidth
                  select
                  sx={{ mb: 1 }}
                >
                  {categories && categories.length > 0 ? (
                    categories.map((item:any) => (
                      <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">אין קטגוריות זמינות</MenuItem>
                  )}
                </TextField>
              )}
            />
            <Controller
              name="img"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField label="URL לתמונה" {...field} fullWidth sx={{ mb: 2 }} />
              )}
            />

            {/* שדות עבור מצרכים */}
            <Typography variant="h6" sx={{ mt: 4 }}>מצרכים</Typography>
            {ingredientFields.map((item, index) => (
              <Box key={item.id || index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Controller
                  name={`ingredients.${index}.name`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField label="שם מצרך" {...field} fullWidth sx={{ mr: 1 }} />
                  )}
                />
                <Controller
                  name={`ingredients.${index}.count`}
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField label="כמות" type="number" {...field} fullWidth sx={{ mr: 1 }} />
                  )}
                />
                <Controller
                  name={`ingredients.${index}.type`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField label="סוג" {...field} fullWidth sx={{ mr: 1 }} />
                  )}
                />
                <Button variant="outlined" color="error" onClick={() => removeIngredient(index)}>-</Button>
              </Box>
            ))}
            <Button variant="contained" onClick={() => addIngredient({ name: "", count: 0, type: "" })} sx={{ mb: 2, backgroundColor: '#FFD700', color: '#000' }}>הוסף מצרך</Button>

            {/* שדות עבור הוראות */}
            <Typography variant="h6" sx={{ mt: 4 }}>הוראות</Typography>
            {instructionFields.map((item, index) => (
              <Box key={item.id || index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Controller
                  name={`instructions.${index}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField label={`הוראה ${index + 1}`} {...field} fullWidth />
                  )}
                />
                <Button variant="outlined" color="error" onClick={() => removeInstruction(index)}>-</Button>
              </Box>
            ))}
            <Button variant="contained" onClick={() => addInstruction("")} sx={{ mb: 2, backgroundColor: '#FFD700', color: '#000' }}>הוסף הוראה</Button>

            <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#FFD700', color: '#000' }}>
              שמור מתכון
            </Button>
          </form>
        </Paper>
      </Container>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        sx={{ marginTop: '64px' }} 
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default EditRecipe;
