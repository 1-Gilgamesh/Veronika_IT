import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const AdminSchedule = () => {
    const [masters, setMasters] = useState([]);
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    // Стан для форми створення нового майстра
    const [newMaster, setNewMaster] = useState({ first_name: '', last_name: '', position: '', phone: '' });

    // Завантаження списку майстрів
    useEffect(() => {
        loadMasters();
    }, []);

    const loadMasters = async () => {
        const res = await axios.get('/employees');
        setMasters(res.data);
    };

    // Додавання майстра
    const handleAddMaster = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/employees', newMaster);
            alert('Майстра додано!');
            setNewMaster({ first_name: '', last_name: '', position: '', phone: '' });
            loadMasters();
        } catch (err) {
            alert('Помилка додавання');
        }
    };

    // Видалення майстра
    const handleDeleteMaster = async (id) => {
        if (window.confirm('Видалити майстра і всі його дані?')) {
            try {
                await axios.delete(`/schedule/employees/${id}`);
                loadMasters();
                if (selectedMaster?.id === id) setSelectedMaster(null);
            } catch (err) {
                alert('Помилка видалення');
            }
        }
    };

    // Вибір майстра і завантаження його графіку
    const handleSelectMaster = async (master) => {
        setSelectedMaster(master);
        setLoading(true);
        try {
            const res = await axios.get(`/schedule/${master.id}`);
            
            // Якщо графік вже є в БД - беремо його, якщо ні - генеруємо пустий шаблон
            if (res.data.length > 0) {
                setSchedule(res.data);
            } else {
                setSchedule(generateDefaultSchedule(master.id));
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // Зміна галочки або часу в графіку
    const handleScheduleChange = (index, field, value) => {
        const updated = [...schedule];
        updated[index][field] = value;
        setSchedule(updated);
    };

    // Збереження графіку
    const handleSaveSchedule = async () => {
        try {
            await axios.post(`/schedule/${selectedMaster.id}`, { schedule });
            alert('Графік збережено!');
        } catch (err) {
            alert('Помилка збереження');
        }
    };

    return (
        <div className="container">
            <h1>👨‍🔧 Майстри та Графік роботи</h1>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                
                {/* --- ЛІВА КОЛОНКА: СПИСОК МАЙСТРІВ --- */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    
                    {/* Форма додавання */}
                    <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                        <h3>➕ Додати майстра</h3>
                        <form onSubmit={handleAddMaster} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input placeholder="Ім'я" value={newMaster.first_name} onChange={e => setNewMaster({...newMaster, first_name: e.target.value})} required style={inputStyle} />
                                <input placeholder="Прізвище" value={newMaster.last_name} onChange={e => setNewMaster({...newMaster, last_name: e.target.value})} required style={inputStyle} />
                            </div>
                            <input placeholder="Посада (напр. Електрик)" value={newMaster.position} onChange={e => setNewMaster({...newMaster, position: e.target.value})} required style={inputStyle} />
                            <input placeholder="Телефон" value={newMaster.phone} onChange={e => setNewMaster({...newMaster, phone: e.target.value})} style={inputStyle} />
                            <button type="submit" style={addBtnStyle}>Додати</button>
                        </form>
                    </div>

                    {/* Список */}
                    <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                        {masters.map(m => (
                            <div key={m.id} 
                                 onClick={() => handleSelectMaster(m)}
                                 style={{ 
                                     padding: '15px', 
                                     borderBottom: '1px solid #eee', 
                                     cursor: 'pointer',
                                     background: selectedMaster?.id === m.id ? '#e7f1ff' : '#fff',
                                     display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                 }}
                            >
                                <div>
                                    <strong>{m.first_name} {m.last_name}</strong>
                                    <div style={{ fontSize: '0.9em', color: '#666' }}>{m.position}</div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteMaster(m.id); }} style={delBtnStyle}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- ПРАВА КОЛОНКА: ГРАФІК --- */}
                <div style={{ flex: 2, minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    {selectedMaster ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>📅 Графік: {selectedMaster.first_name} {selectedMaster.last_name}</h2>
                                <button onClick={handleSaveSchedule} style={saveBtnStyle}>💾 Зберегти графік</button>
                            </div>

                            {loading ? <p>Завантаження...</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa' }}>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>День</th>
                                            <th style={{ padding: '10px' }}>Робочий?</th>
                                            <th style={{ padding: '10px' }}>Початок</th>
                                            <th style={{ padding: '10px' }}>Кінець</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedule.map((day, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee', opacity: day.is_working ? 1 : 0.5 }}>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{getDayName(day.day_of_week)}</td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={day.is_working} 
                                                        onChange={(e) => handleScheduleChange(index, 'is_working', e.target.checked)}
                                                        style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                    <input 
                                                        type="time" 
                                                        value={day.start_time} 
                                                        disabled={!day.is_working}
                                                        onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                                                        style={timeInputStyle}
                                                    />
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                    <input 
                                                        type="time" 
                                                        value={day.end_time} 
                                                        disabled={!day.is_working}
                                                        onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                                                        style={timeInputStyle}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                            <p>⬅ Оберіть майстра зі списку ліворуч, щоб налаштувати його графік.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Допоміжні функції
const getDayName = (num) => ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота', 'Неділя'][num - 1];

const generateDefaultSchedule = (masterId) => {
    return Array.from({ length: 7 }, (_, i) => ({
        master_id: masterId,
        day_of_week: i + 1,
        start_time: '09:00',
        end_time: '18:00',
        is_working: i < 5 // Пн-Пт робочі за замовчуванням
    }));
};

// Стилі
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 };
const addBtnStyle = { padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const delBtnStyle = { background: '#dc3545', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' };
const saveBtnStyle = { padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };
const timeInputStyle = { padding: '5px', borderRadius: '4px', border: '1px solid #ccc' };

export default AdminSchedule;