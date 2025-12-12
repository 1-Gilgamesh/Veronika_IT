import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Notification from '../components/Notification';
import './MyAppointments.css';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('/appointments/my');
                setAppointments(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setNotification({
                        message: 'Сесія завершилась. Будь ласка, увійдіть знову.',
                        type: 'warning'
                    });
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }, 2000);
                }
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [navigate]);

    const handlePay = async (appointmentId, amount) => {
        try {
            await axios.post('/payments', {
                appointment_id: appointmentId,
                amount: amount,
                payment_method: 'card'
            });
            setNotification({
                message: "✅ Оплата пройшла успішно!",
                type: 'success'
            });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setNotification({
                message: "Помилка оплати: " + (err.response?.data?.message || err.message),
                type: 'error'
            });
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
            'pending': '⏳ Очікує підтвердження',
            'confirmed': '✅ Підтверджено',
            'completed': '🏁 Виконано',
            'cancelled': '❌ Скасовано',
            'no_show': '🚫 Не з\'явився'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="appointments-container">
                <div className="appointments-loading">Завантаження історії...</div>
            </div>
        );
    }

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <h1>📂 Мої записи</h1>
                <p className="appointments-subtitle">
                    {appointments.length === 0 
                        ? 'У вас поки немає записів' 
                        : `Всього записів: ${appointments.length}`
                    }
                </p>
            </div>

            {appointments.length === 0 ? (
                <div className="appointments-empty">
                    <div className="empty-icon">📅</div>
                    <p>У вас поки немає записів.</p>
                    <Link to="/" className="empty-link">Записатися на ремонт?</Link>
                </div>
            ) : (
                <div className="appointments-list">
                    {appointments.map((app) => (
                        <div key={app.id} className="appointment-card">
                            <div className="appointment-header">
                                <div className="appointment-service">
                                    <h3>{app.Service?.name || 'Послуга видалена'}</h3>
                                    <p className="appointment-master">
                                        👨‍🔧 {app.master?.first_name} {app.master?.last_name}
                                    </p>
                                </div>
                                <div 
                                    className="appointment-status"
                                    style={{ backgroundColor: getStatusColor(app.status) + '20', color: getStatusColor(app.status) }}
                                >
                                    {getStatusLabel(app.status)}
                                </div>
                            </div>

                            <div className="appointment-details">
                                <div className="appointment-detail-item">
                                    <span className="detail-icon">📅</span>
                                    <span className="detail-text">
                                        {new Date(app.start_datetime).toLocaleDateString('uk-UA', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="appointment-detail-item">
                                    <span className="detail-icon">🕒</span>
                                    <span className="detail-text">
                                        {new Date(app.start_datetime).toLocaleTimeString('uk-UA', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="appointment-detail-item">
                                    <span className="detail-icon">💰</span>
                                    <span className="detail-text price">{app.Service?.price} грн</span>
                                </div>
                            </div>

                            {app.status === 'pending' && (
                                <button 
                                    className="appointment-pay-button"
                                    onClick={() => handlePay(app.id, app.Service?.price)}
                                >
                                    💳 Оплатити
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

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

export default MyAppointments;
