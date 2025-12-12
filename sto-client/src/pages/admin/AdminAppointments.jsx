import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Notification from '../../components/Notification';
import CustomDropdown from '../../components/CustomDropdown';
import './AdminShared.css';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const res = await axios.get('/appointments');
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            setNotification({ message: 'Помилка завантаження списку записів', type: 'error' });
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`/appointments/${id}/status`, { status: newStatus });
            setAppointments(prev => prev.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));
            setNotification({ message: '✅ Статус оновлено!', type: 'success' });
        } catch (err) {
            setNotification({ message: 'Не вдалося змінити статус', type: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#28a745';
            case 'completed': return '#17a2b8';
            case 'cancelled': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#6c757d';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'pending': '⏳ Очікує',
            'confirmed': '✅ Підтверджено',
            'completed': '🏁 Виконано',
            'cancelled': '❌ Скасовано',
            'no_show': '🚫 Не з\'явився'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">Завантаження...</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>📅 Управління записами</h1>
                <p className="admin-subtitle">Всього записів: {appointments.length}</p>
            </div>

            <div className="admin-card" style={{ overflowX: 'auto' }}>
                {appointments.length === 0 ? (
                    <div className="admin-empty">Записів поки немає</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Клієнт</th>
                                <th>Послуга</th>
                                <th>Майстер</th>
                                <th>Дата та Час</th>
                                <th>Ціна</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id}>
                                    <td><strong>#{app.id}</strong></td>
                                    <td>
                                        <strong>{app.client?.full_name || 'Невідомо'}</strong>
                                        {app.client?.email && (
                                            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                                {app.client.email}
                                            </div>
                                        )}
                                    </td>
                                    <td>{app.Service?.name || 'Послуга видалена'}</td>
                                    <td>{app.master?.first_name} {app.master?.last_name}</td>
                                    <td>
                                        {new Date(app.start_datetime).toLocaleString('uk-UA', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td><strong>{app.Service?.price || 0} грн</strong></td>
                                    <td>
                                        <CustomDropdown
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            options={[
                                                { value: 'pending', label: '⏳ Очікує' },
                                                { value: 'confirmed', label: '✅ Підтверджено' },
                                                { value: 'completed', label: '🏁 Виконано' },
                                                { value: 'cancelled', label: '❌ Скасовано' },
                                                { value: 'no_show', label: '🚫 Не з\'явився' }
                                            ]}
                                            placeholder={getStatusLabel(app.status)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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

export default AdminAppointments;
