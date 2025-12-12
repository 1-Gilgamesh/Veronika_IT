import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Notification from '../../components/Notification';
import './AdminShared.css';

const AdminSchedule = () => {
    const [masters, setMasters] = useState([]);
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [newMaster, setNewMaster] = useState({ first_name: '', last_name: '', position: '', phone: '' });

    useEffect(() => {
        loadMasters();
    }, []);

    const loadMasters = async () => {
        try {
            const res = await axios.get('/employees');
            setMasters(res.data);
        } catch (err) {
            setNotification({ message: 'Помилка завантаження майстрів', type: 'error' });
        }
    };

    const handleAddMaster = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/employees', newMaster);
            setNotification({ message: '✅ Майстра додано!', type: 'success' });
            setNewMaster({ first_name: '', last_name: '', position: '', phone: '' });
            loadMasters();
        } catch (err) {
            setNotification({ message: 'Помилка додавання', type: 'error' });
        }
    };

    const handleDeleteMaster = async (id) => {
        if (window.confirm('Видалити майстра і всі його дані?')) {
            try {
                await axios.delete(`/schedule/employees/${id}`);
                setNotification({ message: '✅ Майстра видалено!', type: 'success' });
                loadMasters();
                if (selectedMaster?.id === id) setSelectedMaster(null);
            } catch (err) {
                setNotification({ message: 'Помилка видалення', type: 'error' });
            }
        }
    };

    const handleSelectMaster = async (master) => {
        setSelectedMaster(master);
        setLoading(true);
        try {
            const res = await axios.get(`/schedule/${master.id}`);
            if (res.data.length > 0) {
                setSchedule(res.data);
            } else {
                setSchedule(generateDefaultSchedule(master.id));
            }
        } catch (err) {
            setNotification({ message: 'Помилка завантаження графіку', type: 'error' });
        }
        setLoading(false);
    };

    const handleScheduleChange = (index, field, value) => {
        const updated = [...schedule];
        updated[index][field] = value;
        setSchedule(updated);
    };

    const handleSaveSchedule = async () => {
        try {
            await axios.post(`/schedule/${selectedMaster.id}`, { schedule });
            setNotification({ message: '✅ Графік збережено!', type: 'success' });
        } catch (err) {
            setNotification({ message: 'Помилка збереження', type: 'error' });
        }
    };

    const getDayName = (num) => ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота', 'Неділя'][num - 1];

    const generateDefaultSchedule = (masterId) => {
        return Array.from({ length: 7 }, (_, i) => ({
            master_id: masterId,
            day_of_week: i + 1,
            start_time: '09:00',
            end_time: '18:00',
            is_working: i < 5
        }));
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>👨‍🔧 Майстри та Графік роботи</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                <div>
                    <div className="admin-card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>➕ Додати майстра</h3>
                        <form onSubmit={handleAddMaster} className="admin-form">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input
                                    placeholder="Ім'я"
                                    value={newMaster.first_name}
                                    onChange={e => setNewMaster({...newMaster, first_name: e.target.value})}
                                    required
                                    className="admin-input"
                                />
                                <input
                                    placeholder="Прізвище"
                                    value={newMaster.last_name}
                                    onChange={e => setNewMaster({...newMaster, last_name: e.target.value})}
                                    required
                                    className="admin-input"
                                />
                            </div>
                            <input
                                placeholder="Посада (напр. Електрик)"
                                value={newMaster.position}
                                onChange={e => setNewMaster({...newMaster, position: e.target.value})}
                                required
                                className="admin-input"
                            />
                            <input
                                placeholder="Телефон"
                                value={newMaster.phone}
                                onChange={e => setNewMaster({...newMaster, phone: e.target.value})}
                                className="admin-input"
                            />
                            <button type="submit" className="admin-button admin-button-primary">
                                Додати майстра
                            </button>
                        </form>
                    </div>

                    <div className="admin-card">
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Список майстрів</h3>
                        {masters.length === 0 ? (
                            <div className="admin-empty">Майстрів поки немає</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {masters.map(m => (
                                    <div
                                        key={m.id}
                                        onClick={() => handleSelectMaster(m)}
                                        style={{
                                            padding: '15px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            background: selectedMaster?.id === m.id
                                                ? 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
                                                : '#f8f9fa',
                                            border: selectedMaster?.id === m.id
                                                ? '2px solid #667eea'
                                                : '2px solid transparent',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div>
                                            <strong>{m.first_name} {m.last_name}</strong>
                                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                                                {m.position}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteMaster(m.id);
                                            }}
                                            className="admin-button admin-button-danger"
                                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-card">
                    {selectedMaster ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, color: '#333' }}>
                                    📅 Графік: {selectedMaster.first_name} {selectedMaster.last_name}
                                </h3>
                                <button onClick={handleSaveSchedule} className="admin-button admin-button-primary">
                                    💾 Зберегти
                                </button>
                            </div>

                            {loading ? (
                                <div className="admin-loading">Завантаження...</div>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>День</th>
                                            <th style={{ textAlign: 'center' }}>Робочий?</th>
                                            <th style={{ textAlign: 'center' }}>Початок</th>
                                            <th style={{ textAlign: 'center' }}>Кінець</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedule.map((day, index) => (
                                            <tr key={index} style={{ opacity: day.is_working ? 1 : 0.6 }}>
                                                <td><strong>{getDayName(day.day_of_week)}</strong></td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={day.is_working}
                                                        onChange={(e) => handleScheduleChange(index, 'is_working', e.target.checked)}
                                                        style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="time"
                                                        value={day.start_time}
                                                        disabled={!day.is_working}
                                                        onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                                                        className="admin-input"
                                                        style={{ width: '120px', padding: '8px' }}
                                                    />
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="time"
                                                        value={day.end_time}
                                                        disabled={!day.is_working}
                                                        onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                                                        className="admin-input"
                                                        style={{ width: '120px', padding: '8px' }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    ) : (
                        <div className="admin-empty" style={{ padding: '60px 20px' }}>
                            ⬅ Оберіть майстра зі списку ліворуч, щоб налаштувати його графік.
                        </div>
                    )}
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

export default AdminSchedule;
