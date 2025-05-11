import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import "../home.css"
const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/sighin', data);
            console.log('Success:', response.data);
            navigate('/recipes');
        } catch (error) {
            console.error('Error:', error);
            alert('שגיאה במהלך הפעולה, אנא נסה שוב.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h2>Sign Up</h2>
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

            <input 
                type="text" 
                {...register("name", { required: true })} 
                placeholder="Name" 
            />
            {errors.name && <span style={{ color: 'red' }}>This field is required</span>}

            <input 
                type="text" 
                {...register("phone", { 
                    required: true, 
                    pattern: {
                        value: /^[0-9]+$/, 
                        message: 'Phone must contain only numbers'
                    } 
                })} 
                placeholder="Phone" 
            />
            {errors.phone && <span style={{ color: 'red' }}>{errors.phone.message}</span>}

            <input 
                type="email" 
                {...register("email", { 
                    required: true, 
                    validate: value => value.includes('@') || 'Email must contain "@"' 
                })} 
                placeholder="Email" 
            />
            {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

            <input 
                type="text" 
                {...register("tz", { required: true })} 
                placeholder="ID Number" 
            />
            {errors.tz && <span style={{ color: 'red' }}>This field is required</span>}

            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;
