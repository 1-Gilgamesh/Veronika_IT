import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const res = await axios.get('/appointments'); // GET /api/appointments
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            alert('Помилка завантаження списку записів');
            setLoading(false);
        }
    };

    // Функція зміни статусу
    const handleStatusChange = async (id, newStatus) => {
        try {
            // Відправляємо PATCH запит
            await axios.patch(`/appointments/${id}/status`, { status: newStatus });
            
            // Оновлюємо стан локально (щоб не перезавантажувати сторінку)
            setAppointments(prev => prev.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));
            
        } catch (err) {
            alert('Не вдалося змінити статус');
        }
    };

    // Кольори для статусів
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#d4edda'; // Зелений
            case 'completed': return '#c3e6cb'; // Темний зелений
            case 'cancelled': return '#f8d7da'; // Червоний
            case 'pending':   return '#fff3cd'; // Жовтий
            default: return '#fff';
        }
    };

    if (loading) return <div className="container">Завантаження...</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '20px' }}>📅 Управління записами</h1>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Клієнт</th>
                            <th style={thStyle}>Послуга</th>
                            <th style={thStyle}>Майстер</th>
                            <th style={thStyle}>Дата та Час</th>
                            <th style={thStyle}>Ціна</th>
                            <th style={thStyle}>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #ddd', background: getStatusColor(app.status) }}>
                                <td style={tdStyle}>#{app.id}</td>
                                <td style={tdStyle}>
                                    <strong>{app.client?.full_name}</strong><br/>
                                    <span style={{ fontSize: '0.8em', color: '#555' }}>{app.client?.email}</span>
                                </td>
                                <td style={tdStyle}>{app.Service?.name}</td>
                                <td style={tdStyle}>{app.master?.first_name} {app.master?.last_name}</td>
                                <td style={tdStyle}>
                                    {new Date(app.start_datetime).toLocaleString('uk-UA', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td style={tdStyle}>{app.Service?.price} грн</td>
                                <td style={tdStyle}>
                                    {/* Випадаючий список для зміни статусу */}
                                    <select 
                                        value={app.status} 
                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                        style={{ 
                                            padding: '5px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #999',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="pending">⏳ Очікує</option>
                                        <option value="confirmed">✅ Підтверджено</option>
                                        <option value="completed">🏁 Виконано</option>
                                        <option value="cancelled">❌ Скасовано</option>
                                        <option value="no_show">🚫 Не з'явився</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && <p style={{ padding: '20px', textAlign: 'center' }}>Записів поки немає.</p>}
            </div>
        </div>
    );
};

// Стилі таблиці
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px', verticalAlign: 'middle' };

export default AdminAppointments;