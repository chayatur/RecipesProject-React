import { useState, useEffect } from "react";
import { Box, Container, TextField, Button, Typography, Snackbar, Paper, MenuItem } from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from "react";
import KitchenIcon from '@mui/icons-material/Kitchen';
import { Categories } from "../Objects";
// import { Difficulty } from "../Objects";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RecipeForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { fields: ingredientFields, append: addIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients"
  });
  const { fields: instructionFields, append: addInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: "instructions"
  });
  const [categories, setCategories] = useState<Categories[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Categories[]>("http://localhost:8080/api/category");
        setCategories(res.data.map(category => ({
          Id: category.Id,
          Name: category.Name
        })));
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data:any) => {
    try {
        const payload = {
            Name: data.name,
            Description: data.description,
            Difficulty: data.difficulty === 'low' ? 1: data.difficulty === 'medium' ? 2 : 3,
            Duration: Number(data.duration),
            Img: data.img,
            UserId:Number(sessionStorage.getItem("userId") ),
            Categoryid: Number(data.Categoryid), 
            Ingridents: data.ingredients.map((ingredient:any) => ({ 
                Name: ingredient.name,
                Count: Number(ingredient.count), 
                Type: ingredient.type,
            })),
            Instructions: data.instructions.map((instruction:any) => ({
                Name: instruction,
            })),
        };

        console.log("Payload being sent:", payload);
        const res = await axios.post<any>("http://localhost:8080/api/recipe", payload);
        setSnackbarMessage('המתכון נוסף בהצלחה!');
        setSnackbarSeverity('success');
    } catch (error:any) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        setSnackbarMessage('שגיאה בהוספת המתכון. אנא נסה שוב.');
        setSnackbarSeverity('error');
    } finally {
        setSnackbarOpen(true);
    }
};

  return (
    <Box sx={{ minHeight: "100vh", opacity: "90%", py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, opacity: "80%", width: "75%", margin: "0 auto" }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#d35400' }}>
            <KitchenIcon sx={{ mr: 1 }} /> הוספת מתכון
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "שם המתכון הוא שדה חובה." }}
              render={({ field }) => (
                <TextField label="שם המתכון" required {...field} fullWidth sx={{ mb: 2 }} error={!!errors.name} 
                // helperText={errors.name?.message} 
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "תיאור הוא שדה חובה." }}
              render={({ field }) => (
                <TextField label="תיאור" required {...field} fullWidth multiline rows={3} sx={{ mb: 2 }} error={!!errors.description} 
                // helperText={errors.description?.message} 
                />
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
              name="Categoryid" 
              control={control}
              defaultValue=""
              rules={{ required: "בחר קטגוריה." }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="קטגוריה"
                  fullWidth
                  select
                  size="small"
                  error={!!errors.Categoryid} 
                  sx={{ mb: 1 }}
                  required
                >
                  <MenuItem value="" disabled>בחר קטגוריה</MenuItem>
                  {categories && categories.length > 0 ? (
                    categories.map((item) => (
                      <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>אין קטגוריות זמינות</MenuItem>
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
};

export default RecipeForm;
