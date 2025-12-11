import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const AdminUsers = () => {
    // Дані
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);
    
    // Стан інтерфейсу
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null); // Кого ми зараз записуємо?

    // Форма запису
    const [bookingData, setBookingData] = useState({
        service_id: '',
        master_id: '',
        datetime: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersRes, servicesRes, mastersRes] = await Promise.all([
                axios.get('/users/clients'),
                axios.get('/services'),
                axios.get('/employees')
            ]);
            setClients(usersRes.data);
            setServices(servicesRes.data);
            setMasters(mastersRes.data);
        } catch (err) {
            alert('Помилка завантаження даних');
        }
    };

    // Фільтрація клієнтів (пошук)
    const filteredClients = clients.filter(c => 
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Створити запис
    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/appointments', {
                client_id: selectedClient.id, // <--- Передаємо ID обраного клієнта
                service_id: bookingData.service_id,
                master_id: bookingData.master_id,
                start_datetime: bookingData.datetime
            });
            alert(`✅ Успішно записано клієнта ${selectedClient.full_name}!`);
            setSelectedClient(null); // Закрити форму
            setBookingData({ service_id: '', master_id: '', datetime: '' });
        } catch (err) {
            alert("Помилка: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container">
            <h1>👥 База Клієнтів</h1>

            {/* --- БЛОК 1: ПОШУК І ТАБЛИЦЯ --- */}
            {!selectedClient && (
                <>
                    <input 
                        type="text" 
                        placeholder="🔍 Пошук за ім'ям або email..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', width: '100%', marginBottom: '20px', boxSizing: 'border-box' }}
                    />

                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #ddd' }}>
                        <thead>
                            <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>ПІБ</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>#{client.id}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{client.full_name}</td>
                                    <td style={{ padding: '12px' }}>{client.email}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button 
                                            onClick={() => setSelectedClient(client)}
                                            style={bookBtnStyle}
                                        >
                                            📅 Записати
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* --- БЛОК 2: ФОРМА ЗАПИСУ (З'являється при виборі клієнта) --- */}
            {selectedClient && (
                <div style={{ background: '#e9ecef', padding: '30px', borderRadius: '10px', border: '1px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>📝 Запис для клієнта: <span style={{color: '#007bff'}}>{selectedClient.full_name}</span></h2>
                        <button onClick={() => setSelectedClient(null)} style={cancelBtnStyle}>✕ Скасувати</button>
                    </div>
                    
                    <form onSubmit={handleCreateAppointment} style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
                        
                        <label>
                            <strong>Послуга:</strong>
                            <select 
                                value={bookingData.service_id}
                                onChange={e => setBookingData({...bookingData, service_id: e.target.value})}
                                required style={inputStyle}
                            >
                                <option value="">-- Оберіть послугу --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price} грн)</option>)}
                            </select>
                        </label>

                        <label>
                            <strong>Майстер:</strong>
                            <select 
                                value={bookingData.master_id}
                                onChange={e => setBookingData({...bookingData, master_id: e.target.value})}
                                required style={inputStyle}
                            >
                                <option value="">-- Оберіть майстра --</option>
                                {masters.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                            </select>
                        </label>

                        <label>
                            <strong>Дата та час:</strong>
                            <input 
                                type="datetime-local" 
                                value={bookingData.datetime}
                                onChange={e => setBookingData({...bookingData, datetime: e.target.value})}
                                required style={inputStyle}
                            />
                        </label>

                        <button type="submit" style={submitBtnStyle}>Підтвердити запис</button>
                    </form>
                </div>
            )}
        </div>
    );
};

// Стилі
const bookBtnStyle = { padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const cancelBtnStyle = { padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const submitBtnStyle = { padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' };

export default AdminUsers;