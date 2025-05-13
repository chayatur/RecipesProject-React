import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller, useFieldArray } from "react-hook-form";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditRecipe = () => {
  const { id } = useParams();
  const { control, handleSubmit, reset } = useForm();
  const { fields: ingredientFields, append: addIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "Ingridents"
  });
  const { fields: instructionFields, append: addInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: "Instructions"
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeRes, categoriesRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/recipe/${id}`),
          axios.get("http://localhost:8080/api/category"),
        ]);
        reset(recipeRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    const currentUserId = sessionStorage.getItem("userId");
    const recipeOwnerId = data.UserId;

    if (!recipeOwnerId) {
      alert("לא ניתן למצוא את בעל המתכון.");
      return;
    }

    if (String(currentUserId) !== String(recipeOwnerId)) {
      alert("אין לך הרשאה לערוך את המתכון הזה.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/recipe/edit`, data);
      setSnackbarMessage('המתכון נשמר בהצלחה!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
      setSnackbarMessage('שגיאה בשמירת המתכון.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    const currentUserId = sessionStorage.getItem("userId");
    const recipeOwnerId = control._formValues.UserId;

    if (currentUserId != recipeOwnerId) {
      alert("אין לך הרשאה למחוק את המתכון הזה.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/recipe/delete/${id}`);
      alert("המתכון נמחק בהצלחה");
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setSnackbarMessage('שגיאה במחיקת המתכון.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error || "לא נמצא מתכון"}
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", opacity: "90%", py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, opacity: "80%", width: "75%", margin: "0 auto" }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#d35400' }}>
            עריכת מתכון
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="Name"
              control={control}
              render={({ field }) => (
                <TextField label="שם המתכון" {...field} fullWidth variant="outlined" sx={{ mb: 2 }} />
              )}
            />
            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <TextField label="תיאור" {...field} fullWidth multiline rows={4} variant="outlined" sx={{ mb: 2 }} />
              )}
            />
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="Categoryid-label">קטגוריה</InputLabel>
              <Controller
                name="Categoryid"
                control={control}
                render={({ field }) => (
                  <Select labelId="Categoryid-label" {...field}>
                    {categories.map((item) => (
                      <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Controller
              name="Difficulty"
              control={control}
              render={({ field }) => (
                <TextField label="דרגת קושי" {...field} fullWidth variant="outlined" sx={{ mb: 2 }} />
              )}
            />
            <Controller
              name="Duration"
              control={control}
              render={({ field }) => (
                <TextField label="משך זמן הכנה (דקות)" {...field} fullWidth variant="outlined" sx={{ mb: 2 }} />
              )}
            />
            <Typography variant="h6" sx={{ mt: 4 }}>מצרכים</Typography>
            {ingredientFields.map((item, index) => (
              <Paper key={item.id || index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Controller
                      name={`Ingridents.${index}.Name`}
                      control={control}
                      render={({ field }) => (
                        <TextField label="שם" {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name={`Ingridents.${index}.Count`}
                      control={control}
                      render={({ field }) => (
                        <TextField label="כמות" {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name={`Ingridents.${index}.Type`}
                      control={control}
                      render={({ field }) => (
                        <TextField label="סוג" {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <IconButton onClick={() => removeIngredient(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button variant="contained" onClick={() => addIngredient({ Name: "", Count: "", Type: "" })} startIcon={<AddIcon />} sx={{ mb: 2, backgroundColor: '#FFD700', color: '#000' }}>הוסף מצרך</Button>

            {/* שדות עבור הוראות */}
            <Typography variant="h6" sx={{ mt: 4 }}>הוראות הכנה</Typography>
            {instructionFields.map((item, index) => (
              <Box key={item.id || index} display="flex" alignItems="center" gap={2} mb={2}>
                <Controller
                  name={`Instructions.${index}.Name`}
                  control={control}
                  render={({ field }) => (
                    <TextField label={`הוראה ${index + 1}`} {...field} fullWidth variant="outlined" />
                  )}
                />
                <IconButton color="error" onClick={() => removeInstruction(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant="contained" onClick={() => addInstruction({ Name: "" })} startIcon={<AddIcon />} sx={{ mb: 2, backgroundColor: '#FFD700', color: '#000' }}>הוסף הוראה</Button>

            <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#FFD700', color: '#000', mt: 2 }}>
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
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditRecipe;
