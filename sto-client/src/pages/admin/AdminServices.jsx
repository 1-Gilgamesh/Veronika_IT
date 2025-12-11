import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const AdminServices = () => {
    // Стан списку послуг
    const [services, setServices] = useState([]);
    
    // Стан форми
    const [formData, setFormData] = useState({
        id: null, // Якщо null - це створення, якщо є число - редагування
        name: '',
        description: '',
        price: '',
        duration_minutes: ''
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const res = await axios.get('/services');
            setServices(res.data);
        } catch (err) {
            alert('Помилка завантаження послуг');
        }
    };

    // Обробка полів вводу
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Вибір послуги для редагування
    const handleEdit = (service) => {
        setFormData({
            id: service.id,
            name: service.name,
            description: service.description || '',
            price: service.price,
            duration_minutes: service.duration_minutes
        });
    };

    // Скасування редагування (очищення форми)
    const handleCancel = () => {
        setFormData({ id: null, name: '', description: '', price: '', duration_minutes: '' });
    };

    // Відправка форми (Create або Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // РЕДАГУВАННЯ (PUT)
                await axios.put(`/services/${formData.id}`, formData);
                alert('Послугу оновлено!');
            } else {
                // СТВОРЕННЯ (POST)
                await axios.post('/services', formData);
                alert('Послугу створено!');
            }
            loadServices(); // Оновлюємо таблицю
            handleCancel(); // Очищуємо форму
        } catch (err) {
            alert('Помилка збереження');
        }
    };

    // Видалення
    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю послугу?')) {
            try {
                await axios.delete(`/services/${id}`);
                loadServices();
            } catch (err) {
                alert('Помилка видалення');
            }
        }
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '20px' }}>🛠️ Управління послугами</h1>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* --- ЛІВА ЧАСТИНА: ФОРМА --- */}
                <div style={{ flex: 1, minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', height: 'fit-content' }}>
                    <h3>{formData.id ? '✏️ Редагувати послугу' : '➕ Додати нову послугу'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="text" name="name" placeholder="Назва послуги" 
                            value={formData.name} onChange={handleChange} required 
                            style={inputStyle}
                        />
                        <textarea 
                            name="description" placeholder="Опис" 
                            value={formData.description} onChange={handleChange} 
                            style={{...inputStyle, height: '80px', resize: 'vertical'}}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="number" name="price" placeholder="Ціна (грн)" 
                                value={formData.price} onChange={handleChange} required 
                                style={inputStyle}
                            />
                            <input 
                                type="number" name="duration_minutes" placeholder="Хв" 
                                value={formData.duration_minutes} onChange={handleChange} required 
                                style={inputStyle}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={saveBtnStyle}>
                                {formData.id ? 'Зберегти зміни' : 'Створити'}
                            </button>
                            {formData.id && (
                                <button type="button" onClick={handleCancel} style={cancelBtnStyle}>
                                    Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* --- ПРАВА ЧАСТИНА: ТАБЛИЦЯ --- */}
                <div style={{ flex: 2, minWidth: '300px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                        <thead>
                            <tr style={{ background: '#333', color: '#fff', textAlign: 'left' }}>
                                <th style={thStyle}>Назва</th>
                                <th style={thStyle}>Ціна</th>
                                <th style={thStyle}>Час</th>
                                <th style={thStyle}>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={tdStyle}>
                                        <strong>{service.name}</strong>
                                        <div style={{ fontSize: '0.85em', color: '#666' }}>{service.description}</div>
                                    </td>
                                    <td style={tdStyle}>{service.price} грн</td>
                                    <td style={tdStyle}>{service.duration_minutes} хв</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleEdit(service)} style={editBtnStyle}>✎</button>
                                        <button onClick={() => handleDelete(service.id)} style={deleteBtnStyle}>🗑</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

// Стилі
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' };
const saveBtnStyle = { padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 };
const cancelBtnStyle = { padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 };
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', verticalAlign: 'top' };
const editBtnStyle = { marginRight: '5px', background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const deleteBtnStyle = { background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

export default AdminServices;