import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Notification from '../components/Notification';
import CustomDropdown from '../components/CustomDropdown';
import CustomCalendar from '../components/CustomCalendar';
import DualRangeSlider from '../components/DualRangeSlider';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    
    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');

    const [bookingData, setBookingData] = useState({
        service_id: '',
        master_id: '',
        datetime: ''
    });

    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const finalServices = services
        .filter(service => {
            const price = parseFloat(service.price);
            const isPriceOk = price >= priceRange.min && price <= priceRange.max;
            const searchLower = searchQuery.toLowerCase();
            const nameMatch = service.name.toLowerCase().includes(searchLower);
            const descMatch = service.description?.toLowerCase().includes(searchLower);
            return isPriceOk && (nameMatch || descMatch);
        })
        .sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });

    const handleInputChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };


    const handleBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setNotification({
                message: "Будь ласка, увійдіть у систему, щоб записатися.",
                type: 'warning'
            });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/appointments', {
                service_id: bookingData.service_id,
                master_id: bookingData.master_id,
                start_datetime: bookingData.datetime
            });

            setNotification({
                message: "✅ Запис успішно створено! Менеджер зв'яжеться з вами.",
                type: 'success'
            });
            setBookingData({ service_id: '', master_id: '', datetime: '' });
        } catch (err) {
            setNotification({
                message: "Помилка запису: " + (err.response?.data?.message || err.message),
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getServiceIcon = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('масл') || nameLower.includes('масло')) return '🛢️';
        if (nameLower.includes('гальм') || nameLower.includes('гальма')) return '🛑';
        if (nameLower.includes('шини') || nameLower.includes('колес')) return '🛞';
        if (nameLower.includes('двигун') || nameLower.includes('мотор')) return '⚙️';
        if (nameLower.includes('кондиціонер') || nameLower.includes('клімат')) return '❄️';
        if (nameLower.includes('фарби') || nameLower.includes('покраска')) return '🎨';
        return '🔧';
    };

    const getMasterInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div>Завантаження...</div>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>🛠️ СТО "Booking"</h1>
                    <p>Професійний сервіс для вашого автомобіля</p>
                </div>
                <div className="hero-scroll-indicator">⬇</div>
            </div>

            {/* Main Content */}
            <div className={`main-content ${scrolled ? 'scrolled' : ''}`}>
                <div className="content-container">
                    {/* Search and Filter Bar */}
                    <section className="filter-section">
                        <div className="filter-header">
                            <span>🔍</span>
                            <span>Пошук та фільтри</span>
                        </div>
                        <div className="filter-grid">
                            <div className="search-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Наприклад: Заміна масла..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <DualRangeSlider
                                    min={0}
                                    max={1000000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    label={
                                        <>
                                            <span>💰</span>
                                            Ціна (грн)
                                        </>
                                    }
                                />
                            </div>

                            <div className="filter-group">
                                <CustomDropdown
                                    label={
                                        <>
                                            <span>🔃</span>
                                            Сортувати
                                        </>
                                    }
                                    placeholder="Оберіть сортування"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    options={[
                                        { value: 'asc', label: 'Спочатку дешевші ⬆' },
                                        { value: 'desc', label: 'Спочатку дорожчі ⬇' }
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section>
                        <div className="section-header">
                            <h2>Наші Послуги</h2>
                            <p>Знайдено {finalServices.length} {finalServices.length === 1 ? 'послугу' : finalServices.length < 5 ? 'послуги' : 'послуг'}</p>
                        </div>
                        {finalServices.length > 0 ? (
                            <div className="services-grid">
                                {finalServices.map(service => (
                                    <div key={service.id} className="service-card">
                                        <span className="service-icon">{getServiceIcon(service.name)}</span>
                                        <h3 className="service-name">{service.name}</h3>
                                        <p className="service-description">{service.description || 'Професійна послуга від наших майстрів'}</p>
                                        <div className="service-footer">
                                            <div>
                                                <p className="service-price">{service.price} грн</p>
                                                <p className="service-duration">
                                                    <span>⏱</span>
                                                    <span>{service.duration_minutes} хв</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="service-button"
                                            onClick={() => {
                                                setBookingData({...bookingData, service_id: service.id});
                                                // Scroll to booking form
                                                setTimeout(() => {
                                                    const bookingSection = document.querySelector('.booking-section');
                                                    if (bookingSection) {
                                                        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }
                                                }, 100);
                                            }}
                                        >
                                            Записатися
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <p>Послуг за вашим запитом не знайдено.</p>
                            </div>
                        )}
                    </section>

                    {/* Masters Section */}
                    <section>
                        <div className="section-header">
                            <h2>Наші Майстри</h2>
                            <p>Професійна команда експертів</p>
                        </div>
                        {masters.length > 0 ? (
                            <div className="masters-grid">
                                {masters.map(master => (
                                    <div key={master.id} className="master-card">
                                        <div className="master-avatar">
                                            {getMasterInitials(master.first_name, master.last_name)}
                                        </div>
                                        <h3 className="master-name">{master.first_name} {master.last_name}</h3>
                                        <p className="master-position">{master.position}</p>
                                        <p className="master-phone">
                                            <span>📞</span>
                                            <span>{master.phone || 'Не вказано'}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">👨‍🔧</div>
                                <p>Майстрів поки що немає.</p>
                            </div>
                        )}
                    </section>

                    {/* Booking Form */}
                    {isAuthenticated ? (
                        <section className="booking-section">
                            <h2>📅 Оформити запис</h2>
                            <form onSubmit={handleBooking} className="booking-form-vertical">
                                <CustomDropdown
                                    label="Послуга"
                                    placeholder="Оберіть послугу"
                                    value={bookingData.service_id}
                                    onChange={(e) => setBookingData({ ...bookingData, service_id: e.target.value || '' })}
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
                                    onChange={(e) => setBookingData({ ...bookingData, master_id: e.target.value || '' })}
                                    options={masters.map(m => ({
                                        value: m.id,
                                        label: `${m.first_name} ${m.last_name} (${m.position})`
                                    }))}
                                    required
                                />

                                <CustomCalendar
                                    label="Дата та час"
                                    value={bookingData.datetime}
                                    onChange={handleInputChange}
                                    required
                                />

                                <button 
                                    type="submit" 
                                    className="booking-button"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Обробка...' : 'Підтвердити запис'}
                                </button>
                            </form>
                        </section>
                    ) : (
                        <div className="auth-prompt">
                            <p>Щоб записатися на ремонт, будь ласка, увійдіть або зареєструйтеся.</p>
                            <div>
                                <Link to="/login">Увійти</Link>
                                <span> або </span>
                                <Link to="/register">Зареєструватися</Link>
                            </div>
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
        </>
    );
};

export default Home;
