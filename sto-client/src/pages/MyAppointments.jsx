import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Запит на отримання історії
                const response = await axios.get('/appointments/my');
                setAppointments(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    alert('Сесія завершилась. Будь ласка, увійдіть знову.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [navigate]);

    // --- ФУНКЦІЯ ОПЛАТИ (Нова) ---
    const handlePay = async (appointmentId, amount) => {
        const confirmPay = window.confirm(`Ви хочете оплатити замовлення на суму ${amount} грн? (Імітація картки)`);
        
        if (confirmPay) {
            try {
                await axios.post('/payments', {
                    appointment_id: appointmentId,
                    amount: amount,
                    payment_method: 'card'
                });
                alert("✅ Оплата пройшла успішно!");
                // Оновлюємо сторінку, щоб побачити новий статус
                window.location.reload(); 
            } catch (err) {
                alert("Помилка оплати: " + (err.response?.data?.message || err.message));
            }
        }
    };

    // Функції для відображення статусів
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#d4edda'; // Зелений
            case 'completed': return '#c3e6cb'; // Темно-зелений
            case 'cancelled': return '#f8d7da'; // Червоний
            case 'pending':   return '#fff3cd'; // Жовтий
            default: return '#f8f9fa';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'pending': '⏳ Очікує підтвердження',
            'confirmed': '✅ Підтверджено',
            'completed': '🏁 Виконано',
            'cancelled': '❌ Скасовано',
            'no_show': '🚫 Не з’явився'
        };
        return labels[status] || status;
    };

    if (loading) return <div className="container">Завантаження історії...</div>;

    return (
        <div className="container">
            <h1>📂 Мої записи</h1>

            {appointments.length === 0 ? (
                <p>У вас поки немає записів. <a href="/">Записатися на ремонт?</a></p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {appointments.map((app) => (
                        <div key={app.id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: getStatusColor(app.status),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {/* Ліва частина: Інфо про послугу */}
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>{app.Service?.name || 'Послуга видалена'}</h3>
                                <p style={{ margin: 0 }}>
                                    <strong>Майстер:</strong> {app.master?.first_name} {app.master?.last_name}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#555' }}>
                                    📅 {new Date(app.start_datetime).toLocaleString('uk-UA')}
                                </p>
                            </div>
                            
                            {/* Права частина: Статус, Ціна і КНОПКА */}
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    padding: '5px 10px', 
                                    borderRadius: '20px', 
                                    background: 'rgba(255,255,255,0.6)' 
                                }}>
                                    {getStatusLabel(app.status)}
                                </span>
                                
                                {/* ОСЬ ТУТ ДОДАНА ЛОГІКА КНОПКИ */}
                                {app.status === 'pending' && (
                                    <button 
                                        onClick={() => handlePay(app.id, app.Service?.price)}
                                        style={{ 
                                            display: 'block', 
                                            marginTop: '10px', 
                                            marginLeft: 'auto', // Вирівнювання вправо
                                            padding: '8px 12px', 
                                            background: '#28a745', 
                                            color: 'white', 
                                            border: 'none', 
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        💳 Оплатити
                                    </button>
                                )}
                                
                                <p style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {app.Service?.price} грн
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;