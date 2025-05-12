import axios from "axios";
import { useContext, useState } from "react";
import { User } from "../Objects";
import { userContext } from "../../Context/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CircularProgress, Box, TextField, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  UserName: yup.string().required("יש להזין שם משתמש"),
  Password: yup.string().min(3, "סיסמה חייבת להכיל לפחות3 תווים").required("יש להזין סיסמה"),
  Name: yup.string().required("יש להזין שם מלא"),
  Phone: yup.string().matches(/^\d{10}$/, "מספר טלפון חייב להיות בן 10 ספרות").required("יש להזין טלפון"),
  Email: yup.string().email("כתובת אימייל לא תקינה").required("יש להזין אימייל"),
  Tz: yup.string().length(9, "תעודת זהות חייבת להכיל 9 ספרות").required("יש להזין תעודת זהות"),
});

const SignIn = () => {
  const { setMyUser } = useContext(userContext);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSend = async (data:any) => {
    setLoading(true);
    try {
      const res = await axios.post<User>("http://localhost:8080/api/user/sighin", data, {
        headers: { "Content-Type": "application/json" },
      });
      setMsg("נרשמת בהצלחה");
      setMyUser(res.data);
      reset();
      setIsSubmitted(true);
    } catch (error:any) {
      if (error.response?.data?.includes("unique")) {
        setError("UserName", { message: "המשתמש או האימייל כבר רשומים במערכת" });
      } else {
        setError("UserName", { message: "שגיאה במהלך ההרשמה, אנא נסה שוב." });
      }
    }
    setLoading(false);
  };

  if (isSubmitted) {
    return <Typography variant="h5" align="center">נרשמת בהצלחה</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
      <Paper 
        component="form" 
        onSubmit={handleSubmit(onSend)} 
        sx={{ 
          width: 400, 
          padding: 3, 
          borderRadius: 2, 
          boxShadow: 3, 
          backgroundColor: 'white' 
        }}
      >
        <Typography variant="h4" align="center" color="gold" gutterBottom>הרשמה</Typography>
        {msg && <Typography color="error" variant="body2" align="center">{msg}</Typography>}
        
        <TextField 
          {...register("UserName")} 
          label="שם משתמש" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          error={!!errors.UserName} 
          helperText={errors.UserName?.message} 
        />
        
        <TextField 
          {...register("Password")} 
          label="סיסמה" 
          type="password" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          error={!!errors.Password} 
          helperText={errors.Password?.message} 
        />
        
        <TextField 
          {...register("Name")} 
          label="שם מלא" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          error={!!errors.Name} 
          helperText={errors.Name?.message} 
        />
        
        <TextField 
          {...register("Phone")} 
          label="טלפון" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          error={!!errors.Phone} 
          helperText={errors.Phone?.message} 
        />
        
        <TextField 
          {...register("Email")} 
          label="אימייל" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          error={!!errors.Email} 
          helperText={errors.Email?.message} 
        />
        
        <TextField 
          {...register("Tz")} 
          label="תעודת זהות" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          error={!!errors.Tz} 
          helperText={errors.Tz?.message} 
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ marginTop: 2 }} 
          disabled={!isValid || loading}
        >
          {loading ? <CircularProgress size={24} 
           /> : "הרשמה"}
        </Button>
        
        {errors.UserName?.message === "המשתמש או האימייל כבר רשומים במערכת" && (
          <Link to="/Login" style={{ display: 'block', marginTop: 2, textAlign: 'center' }}>
            לכניסה הקליקו כאן
          </Link>
        )}
      </Paper>
    </Box>
  );
};

export default SignIn;
