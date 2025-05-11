import UserContext from './Context/UserContext';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './components/home';
import Login from './components/user/Login';
import SignIn from './components/user/SignIn';
import ShowRecipes from './components/recipes/ShowRecipes';
import AddRecipe from './components/recipes/AddRecipe'; // ודא שהשם תואם
import EditRecipe from './components/recipes/EditRecipe';

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "signin",
                element: <SignIn />,
            },
            {
                path: "ShowRecipes",
                element: <ShowRecipes />,
            },
            {
                path: "AddRecipe", // עדכון כאן
                element: <AddRecipe />,
            },
            {
                path: "EditRecipe/:id",
                element: <EditRecipe />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" />,
    },
]);

const App = () => {
    return (
        <UserContext>
            <RouterProvider router={routes} />
        </UserContext>
    );
};

export default App;
