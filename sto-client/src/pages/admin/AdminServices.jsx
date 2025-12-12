import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Notification from '../../components/Notification';
import './AdminShared.css';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
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
            setNotification({ message: 'Помилка завантаження послуг', type: 'error' });
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
                await axios.put(`/services/${formData.id}`, formData);
                setNotification({ message: '✅ Послугу оновлено!', type: 'success' });
            } else {
                await axios.post('/services', formData);
                setNotification({ message: '✅ Послугу створено!', type: 'success' });
            }
            loadServices();
            handleCancel();
        } catch (err) {
            setNotification({ message: 'Помилка збереження', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю послугу?')) {
            try {
                await axios.delete(`/services/${id}`);
                setNotification({ message: '✅ Послугу видалено!', type: 'success' });
                loadServices();
            } catch (err) {
                setNotification({ message: 'Помилка видалення', type: 'error' });
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>🛠️ Управління послугами</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                <div className="admin-card">
                    <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
                        {formData.id ? '✏️ Редагувати послугу' : '➕ Додати нову послугу'}
                    </h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Назва послуги" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="admin-input"
                        />
                        <textarea 
                            name="description" 
                            placeholder="Опис" 
                            value={formData.description} 
                            onChange={handleChange} 
                            className="admin-textarea"
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                            <input 
                                type="number" 
                                name="price" 
                                placeholder="Ціна (грн)" 
                                value={formData.price} 
                                onChange={handleChange} 
                                required 
                                className="admin-input"
                            />
                            <input 
                                type="number" 
                                name="duration_minutes" 
                                placeholder="Хв" 
                                value={formData.duration_minutes} 
                                onChange={handleChange} 
                                required 
                                className="admin-input"
                            />
                        </div>
                        <div className="admin-buttons-group">
                            <button type="submit" className="admin-button admin-button-primary">
                                {formData.id ? 'Зберегти зміни' : 'Створити'}
                            </button>
                            {formData.id && (
                                <button type="button" onClick={handleCancel} className="admin-button admin-button-secondary">
                                    Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-card" style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Ціна</th>
                                <th>Час</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="admin-empty">Послуг поки немає</td>
                                </tr>
                            ) : (
                                services.map(service => (
                                    <tr key={service.id}>
                                        <td>
                                            <strong>{service.name}</strong>
                                            {service.description && (
                                                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                                    {service.description}
                                                </div>
                                            )}
                                        </td>
                                        <td>{service.price} грн</td>
                                        <td>{service.duration_minutes} хв</td>
                                        <td>
                                            <div className="admin-buttons-group">
                                                <button 
                                                    onClick={() => handleEdit(service)} 
                                                    className="admin-button admin-button-edit"
                                                >
                                                    ✎ Редагувати
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(service.id)} 
                                                    className="admin-button admin-button-danger"
                                                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                                >
                                                    🗑 Видалити
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default AdminServices;