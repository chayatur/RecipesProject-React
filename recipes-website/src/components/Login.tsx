import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import "../home.css"
const Login = () => {
    const Navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', data);
            console.log('Success:', response.data);
            Navigate('/recipes');
        } catch (error) {
            console.error('Error:', error);
            alert('שגיאה במהלך הפעולה, אנא נסה שוב.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h2>Login</h2>
            <input 
                type="text" 
                {...register("username", { required: true })} 
                placeholder="Username" 
            />
            {errors.username && <span style={{ color: 'red' }}>This field is required</span>}

            <input 
                type="password" 
                {...register("password", { required: true })} 
                placeholder="Password" 
            />
            {errors.password && <span style={{ color: 'red' }}>This field is required</span>}

            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
