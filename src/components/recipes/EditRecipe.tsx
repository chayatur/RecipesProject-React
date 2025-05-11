import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Container, TextField, Button, Typography, Snackbar, Paper, MenuItem } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { useForm, Controller } from "react-hook-form";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditRecipe = observer(() => {
  const nav = useNavigate();
  const { id } = useParams();
  const { control, handleSubmit, setValue } = useForm();
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
        setValue("Categoryid", recipeData.Categoryid);
        setValue("img", recipeData.Img);
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
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.post(`http://localhost:8080/api/recipe/edit`, { ...data, Id: id });
      setSnackbarMessage('המתכון עודכן בהצלחה!');
      setSnackbarSeverity('success');
    } catch (error) {
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
              name="Categoryid"
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
                    categories.map((item) => (
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
