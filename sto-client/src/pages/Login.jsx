import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.type]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('token', response.data.token);
            alert('Ви успішно увійшли!');
            navigate('/');
            window.location.reload(); 

        } catch (err) {
            setError(err.response?.data?.message || 'Помилка входу');
        }
    };

    return (
        <div className="container">
            <h2>Вхід у систему</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="password" 
                    placeholder="Пароль" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Увійти
                </button>
            </form>
        </div>
    );
};

export default Login;