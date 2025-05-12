import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box } from '@mui/material';
import React, { useState, useContext } from "react";
import { userContext } from "../../Context/UserContext"; // ייבוא הקשר

// הגדרת הסכימה לאימות
const schema = yup.object().shape({
    UserName: yup.string().required("יש להזין שם משתמש"),
    Password: yup.string().min(3 , "סיסמה חייבת להכיל לפחות 3 תווים").required("יש להזין סיסמה"),
});

// הגדרת סוגי הנתונים של הטופס
type FormData = yup.InferType<typeof schema>;

const Login = () => {
    const { setMyUser } = useContext(userContext); // שימוש בהקשר
    const navigate = useNavigate();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await axios.post<any>("http://localhost:8080/api/user/login", data);
            console.log(res.data);
         
            setMyUser(res.data); //
            sessionStorage.setItem('userId', res.data.Id);
            console.log("userId",sessionStorage.getItem("userId"));
            
    
            setLoginSuccess(true);
        } catch (e) {
            console.error(e);
            alert('שגיאה במהלך התחברות, אנא נסה שוב.');
        }
    };

    if (loginSuccess) {
        return (
            <Box textAlign="center">
                <Typography variant="h5">ההתחברות עברה בהצלחה!</Typography>
                
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                width: '300px', 
                padding: '20px', 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                boxShadow: 2, 
                margin: 'auto', 
                marginTop: '100px', 
            }}>
            <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h4" align="center" color="gold">התחברות</Typography>
               
                <TextField 
                    {...register("UserName")} 
                    label="שם משתמש" 
                    fullWidth 
                    margin="normal" 
                    error={!!errors.UserName} 
                    helperText={errors.UserName?.message} 
                />

                <TextField 
                    type="password" 
                    {...register("Password")} 
                    label="סיסמה" 
                    fullWidth 
                    margin="normal" 
                    error={!!errors.Password} 
                    helperText={errors.Password?.message} 
                />

                <Button type="submit" variant="contained" color="primary" disabled={!isValid} fullWidth >
                    התחבר
                </Button>

                {errors.UserName?.message === "user not found!" && (
                    <Link to="/SignIn">להרשמה הקליקו כאן👇</Link>
                )}
            </form>
        </Box>
    );

    
}

export default Login;
