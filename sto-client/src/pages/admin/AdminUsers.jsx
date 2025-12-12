import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Notification from '../../components/Notification';
import CustomDropdown from '../../components/CustomDropdown';
import CustomCalendar from '../../components/CustomCalendar';
import './AdminShared.css';

const AdminUsers = () => {
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [notification, setNotification] = useState(null);
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
            setNotification({ message: 'Помилка завантаження даних', type: 'error' });
        }
    };

    const filteredClients = clients.filter(c =>
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/appointments', {
                client_id: selectedClient.id,
                service_id: bookingData.service_id,
                master_id: bookingData.master_id,
                start_datetime: bookingData.datetime
            });
            setNotification({
                message: `✅ Успішно записано клієнта ${selectedClient.full_name}!`,
                type: 'success'
            });
            setSelectedClient(null);
            setBookingData({ service_id: '', master_id: '', datetime: '' });
        } catch (err) {
            setNotification({
                message: "Помилка: " + (err.response?.data?.message || err.message),
                type: 'error'
            });
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>👥 База Клієнтів</h1>
                <p className="admin-subtitle">Всього клієнтів: {clients.length}</p>
            </div>

            {!selectedClient ? (
                <>
                    <div className="admin-card">
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Пошук за ім'ям або email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="admin-input"
                                style={{ paddingLeft: '45px' }}
                            />
                        </div>
                    </div>

                    <div className="admin-card" style={{ overflowX: 'auto' }}>
                        {filteredClients.length === 0 ? (
                            <div className="admin-empty">
                                {searchTerm ? 'Клієнтів не знайдено' : 'Клієнтів поки немає'}
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ПІБ</th>
                                        <th>Email</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map(client => (
                                        <tr key={client.id}>
                                            <td><strong>#{client.id}</strong></td>
                                            <td><strong>{client.full_name}</strong></td>
                                            <td>{client.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => setSelectedClient(client)}
                                                    className="admin-button admin-button-primary"
                                                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                                >
                                                    📅 Записати
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            ) : (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                        <h3 style={{ margin: 0, color: '#333' }}>
                            📝 Запис для клієнта: <span style={{ color: '#667eea' }}>{selectedClient.full_name}</span>
                        </h3>
                        <button
                            onClick={() => {
                                setSelectedClient(null);
                                setBookingData({ service_id: '', master_id: '', datetime: '' });
                            }}
                            className="admin-button admin-button-secondary"
                        >
                            ✕ Скасувати
                        </button>
                    </div>

                    <form onSubmit={handleCreateAppointment} className="admin-form" style={{ maxWidth: '600px' }}>
                        <CustomDropdown
                            label="Послуга"
                            placeholder="Оберіть послугу"
                            value={bookingData.service_id}
                            onChange={(e) => setBookingData({...bookingData, service_id: e.target.value || ''})}
                            options={services.map(s => ({
                                value: s.id,
                                label: `${s.name} (${s.price} грн)`
                            }))}
                            required
                        />

                        <CustomDropdown
                            label="Майстер"
                            placeholder="Оберіть майстра"
                            value={bookingData.master_id}
                            onChange={(e) => setBookingData({...bookingData, master_id: e.target.value || ''})}
                            options={masters.map(m => ({
                                value: m.id,
                                label: `${m.first_name} ${m.last_name} (${m.position})`
                            }))}
                            required
                        />

                        <CustomCalendar
                            label="Дата та час"
                            value={bookingData.datetime}
                            onChange={(e) => setBookingData({...bookingData, datetime: e.target.value})}
                            required
                        />

                        <button type="submit" className="admin-button admin-button-primary">
                            Підтвердити запис
                        </button>
                    </form>
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

export default AdminUsers;
