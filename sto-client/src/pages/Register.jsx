import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/auth/register', {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('token', response.data.token);
            navigate('/');
            window.location.reload(); 

        } catch (err) {
            setError(err.response?.data?.message || 'Помилка реєстрації');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>📝 Реєстрація</h2>
                    <p>Створіть новий обліковий запис</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="full_name">
                            <span>👤</span>
                            ПІБ
                        </label>
                        <input 
                            id="full_name"
                            type="text" 
                            name="full_name" 
                            placeholder="Іван Петренко" 
                            value={formData.full_name} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

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
                            placeholder="Створіть надійний пароль" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                            disabled={loading}
                            minLength="6"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`auth-button register ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Вже маєте обліковий запис?{' '}
                        <Link to="/login">Увійти</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;