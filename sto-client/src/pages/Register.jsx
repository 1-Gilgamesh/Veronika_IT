import React, { useState } from 'react';
import axios from '../api/axios'; // Наш налаштований клієнт
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    
    // Стан для полів форми
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    // Оновлюємо стан при введенні тексту
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.type === 'email' ? 'email' : e.target.name]: e.target.value
        });
    };

    // Відправка форми
    const handleSubmit = async (e) => {
        e.preventDefault(); // Щоб сторінка не перезавантажувалась
        setError('');

        try {
            // 1. Відправляємо запит на сервер
            const response = await axios.post('/auth/register', {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            // 2. Якщо успіх - зберігаємо токен у LocalStorage
            localStorage.setItem('token', response.data.token);
            
            alert('Реєстрація успішна!');
            
            // 3. Перекидаємо на головну
            navigate('/');
            
            // (Опціонально) Перезавантажити сторінку, щоб оновилось меню
            window.location.reload(); 

        } catch (err) {
            // Якщо помилка (наприклад, такий email вже є)
            setError(err.response?.data?.message || 'Помилка реєстрації');
        }
    };

    return (
        <div className="container">
            <h2>Реєстрація нового клієнта</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    name="full_name" 
                    placeholder="ПІБ (напр. Іван Петренко)" 
                    value={formData.full_name} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Пароль" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Зареєструватися
                </button>
            </form>
        </div>
    );
};

export default Register;