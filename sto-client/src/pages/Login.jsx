import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name || e.target.type]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('token', response.data.token);
            navigate('/');
            window.location.reload(); 

        } catch (err) {
            setError(err.response?.data?.message || 'Помилка входу');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>🔑 Вхід у систему</h2>
                    <p>Ласкаво просимо назад!</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <span>📧</span>
                            Email
                        </label>
                        <input 
                            id="email"
                            type="email" 
                            name="email"
                            placeholder="your.email@example.com" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <span>🔒</span>
                            Пароль
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            name="password"
                            placeholder="Введіть ваш пароль" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`auth-button login ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Немає облікового запису?{' '}
                        <Link to="/register">Зареєструватися</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;