import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    // Стан даних
    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- СТАНИ ДЛЯ ФІЛЬТРІВ ТА ПОШУКУ ---
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' або 'desc'
    const [searchQuery, setSearchQuery] = useState(''); // <--- 1. НОВИЙ СТАН ДЛЯ ПОШУКУ

    // Стан форми запису
    const [bookingData, setBookingData] = useState({
        service_id: '',
        master_id: '',
        datetime: ''
    });

    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, mastersRes] = await Promise.all([
                    axios.get('/services'),
                    axios.get('/employees')
                ]);
                setServices(servicesRes.data);
                setMasters(mastersRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Помилка завантаження даних:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- ЛОГІКА: ПОШУК + ФІЛЬТР + СОРТУВАННЯ ---
    const finalServices = services
        .filter(service => {
            // 1. Фільтр за ціною
            const price = parseFloat(service.price);
            const isPriceOk = price >= priceRange.min && price <= priceRange.max;

            // 2. Фільтр за текстом (Пошук)
            // Переводимо все в малі літери для коректного порівняння
            const searchLower = searchQuery.toLowerCase();
            const nameMatch = service.name.toLowerCase().includes(searchLower);
            const descMatch = service.description?.toLowerCase().includes(searchLower); // Шукаємо і в описі теж

            return isPriceOk && (nameMatch || descMatch);
        })
        .sort((a, b) => {
            // 3. Сортування
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });

    // Обробка форми
    const handleInputChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть у систему, щоб записатися.");
            navigate('/login');
            return;
        }

        try {
            await axios.post('/appointments', {
                service_id: bookingData.service_id,
                master_id: bookingData.master_id,
                start_datetime: bookingData.datetime
            });

            alert("✅ Запис успішно створено! Менеджер зв'яжеться з вами.");
            setBookingData({ service_id: '', master_id: '', datetime: '' });
        } catch (err) {
            alert("Помилка запису: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="container">Завантаження...</div>;

    return (
        <div className="container">
            <h1>Ласкаво просимо до СТО "Booking"</h1>

            {/* --- ПАНЕЛЬ УПРАВЛІННЯ --- */}
            <section style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    
                    {/* 1. ПОЛЕ ПОШУКУ */}
                    <div style={{ flexGrow: 1, minWidth: '200px' }}>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>🔍 Пошук послуги:</label>
                        <input 
                            type="text" 
                            placeholder="Наприклад: Заміна масла..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    {/* 2. Фільтр ціни */}
                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>💰 Ціна (грн):</label>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                placeholder="Від"
                                value={priceRange.min} 
                                onChange={e => setPriceRange({...priceRange, min: Number(e.target.value)})}
                                style={smallInputStyle}
                            />
                            <span>-</span>
                            <input 
                                type="number" 
                                placeholder="До"
                                value={priceRange.max} 
                                onChange={e => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                style={smallInputStyle}
                            />
                        </div>
                    </div>

                    {/* 3. Сортування */}
                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>🔃 Сортувати:</label>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                        >
                            <option value="asc">Спочатку дешевші ⬆</option>
                            <option value="desc">Спочатку дорожчі ⬇</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* --- СПИСОК ПОСЛУГ --- */}
            <section style={{ marginBottom: '40px' }}>
                <h2>Наші Послуги ({finalServices.length})</h2>
                <div style={gridStyle}>
                    {finalServices.length > 0 ? finalServices.map(service => (
                        <div key={service.id} style={cardStyle}>
                            <h3>{service.name}</h3>
                            <p style={{ fontStyle: 'italic', color: '#555' }}>{service.description}</p>
                            <div style={{ marginTop: 'auto' }}>
                                <p style={{ fontSize: '1.2rem' }}><strong>{service.price} грн</strong></p>
                                <p>⏱ {service.duration_minutes} хв</p>
                                <button 
                                    onClick={() => setBookingData({...bookingData, service_id: service.id})}
                                    style={buttonStyle}
                                >
                                    Записатися
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#666' }}>
                            <p>Послуг за вашим запитом не знайдено.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- СПИСОК МАЙСТРІВ --- */}
            <section style={{ marginBottom: '40px' }}>
                <h2>👨‍🔧 Наші Майстри</h2>
                <div style={gridStyle}>
                    {masters.map(master => (
                        <div key={master.id} style={cardStyle}>
                            <h3>{master.first_name} {master.last_name}</h3>
                            <p style={{ color: '#007bff', fontWeight: 'bold' }}>{master.position}</p>
                            <p>📞 {master.phone || 'Не вказано'}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ФОРМА ЗАПИСУ --- */}
            {isAuthenticated ? (
                <section style={{ background: '#e9ecef', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                    <h2>📅 Оформити запис</h2>
                    <form onSubmit={handleBooking} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        
                        <div>
                            <label>Послуга:</label><br/>
                            <select 
                                name="service_id" 
                                value={bookingData.service_id} 
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">-- Оберіть послугу --</option>
                                {/* Виводимо повний список services, щоб у формі можна було обрати навіть те, що зараз приховано фільтром */}
                                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price} грн)</option>)}
                            </select>
                        </div>

                        <div>
                            <label>Майстер:</label><br/>
                            <select 
                                name="master_id" 
                                value={bookingData.master_id} 
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">-- Оберіть майстра --</option>
                                {masters.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.position})</option>)}
                            </select>
                        </div>

                        <div>
                            <label>Дата та час:</label><br/>
                            <input 
                                type="datetime-local" 
                                name="datetime" 
                                value={bookingData.datetime} 
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" style={{...buttonStyle, background: '#28a745', marginTop: '0', height: '38px'}}>
                            Підтвердити
                        </button>
                    </form>
                </section>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', background: '#fff3cd', borderRadius: '8px' }}>
                    <p>Щоб записатися на ремонт, будь ласка, <a href="/login">увійдіть</a> або <a href="/register">зареєструйтеся</a>.</p>
                </div>
            )}
        </div>
    );
};

// Стилі
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' };
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '220px' };
const smallInputStyle = { padding: '8px', width: '80px', border: '1px solid #ccc', borderRadius: '4px' };
const buttonStyle = { padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' };

export default Home;