import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Profile = () => {
    const [userData, setUserData] = useState({ full_name: '', email: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Завантажуємо актуальні дані при відкритті
        axios.get('/auth/profile')
            .then(res => setUserData(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/auth/profile', userData);
            setMessage('✅ Дані успішно збережено!');
        } catch (err) {
            setMessage('❌ Помилка оновлення');
        }
    };

    return (
        <div className="container">
            <h1>👤 Мій профіль</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleUpdate} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>
                    Ім'я та Прізвище:
                    <input 
                        type="text" 
                        value={userData.full_name} 
                        onChange={e => setUserData({...userData, full_name: e.target.value})}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </label>
                <label>
                    Email:
                    <input 
                        type="email" 
                        value={userData.email} 
                        onChange={e => setUserData({...userData, email: e.target.value})}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </label>
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none' }}>
                    Зберегти зміни
                </button>
            </form>
        </div>
    );
};
export default Profile;