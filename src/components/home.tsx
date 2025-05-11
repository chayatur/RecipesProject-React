import { useContext } from 'react';
import { Button, Container, Box } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { userContext } from '../Context/UserContext';
import '../style/home.css';
import HomeIcon from '@mui/icons-material/Home'; 

const Home = () => {
    const { myUser } = useContext(userContext);
    const location = useLocation();

    return (
        <Container className="home-container">
            <Box className="header">
                {!myUser && (
                    <Button 
                        variant="outlined" 
                        className="button" 
                        component={Link} 
                        to="/login"
                    >
                        כניסה
                    </Button>
                )}
                {!myUser && (
                    <Button 
                        variant="outlined" 
                        className="button" 
                        component={Link} 
                        to="/signIn"
                    >
                        הרשמה
                    </Button>
                )}
                {myUser && (
                    <Button 
                        variant="outlined" 
                        className="button" 
                        component={Link} 
                        to="/ShowRecipes"
                    >
                        המתכונים שלנו
                    </Button>
                )}
                {myUser && (
                    <Button 
                        variant="outlined" 
                        className="button" 
                        component={Link} 
                        to="/AddRecipe"
                    >
                        הוספת מתכון
                    </Button>
                )}
                <Button 
                    variant="outlined" 
                    className="button" 
                    component={Link} 
                    to="/"
                >
                  <HomeIcon />
                </Button>
            </Box>
            <Box className="hero-content">
                {location.pathname === '/' && <h1 className="hero-title">ברוכים הבאים לעולם המתכונים שלנו</h1>}
            </Box>
            <Box className="outlet">
                <Outlet />
            </Box>
            <Box className="footer">
                <p>כל הזכויות שמורות © 2025 | ליצירת קשר recipes@gmail.com</p>
            </Box>
        </Container>
    );
};

export default Home;
