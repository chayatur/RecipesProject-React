// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import "../home.css";
// import GetRecipes from "./RecipesList";
// const Home = () => {
//     const nav = useNavigate();

//     return (
//         <>
//             <div>
//                 <button onClick={() => nav("/login")}>התחברות</button>
//                 <button onClick={() => nav("/signup")}>הרשמה</button>
//                 <button onClick={() => nav("/home")}>דף הבית</button>
//                 <button onClick={() => nav("/GetRecipes")}>
//                     <br />:מתכונים מהאתר🍰
//                 </button>
//                 <Outlet />
//             </div>
//         </>
//     );
// };

// export default Home;
// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = false; // כאן תוכל לבדוק אם המשתמש מחובר

    return (
        <div>
            <header>
                <nav>
                    <Link to="/">🏡בית</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/recipes">מתכונים</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">כניסה</Link>
                            <Link to="/signup">הרשמה</Link>
                        </>
                    )}
                </nav>
            </header>
            <h1>דף הבית</h1>
            <p>ברוך הבא לאתר המתכונים שלנו!</p>
        </div>
    );
};

export default Home;
