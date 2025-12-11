import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container">
            <h1>⚙️ Панель Адміністратора</h1>
            <p>Вітаємо в системі управління СТО.</p>

            <div style={gridStyle}>
                {/* 1. Управління послугами */}
                <Link to="/admin/services" style={cardStyle}>
                    <div style={{ fontSize: '30px' }}>🛠️</div>
                    <h3>Послуги</h3>
                    <p>Додати, редагувати або видалити послуги та ціни.</p>
                </Link>

                {/* 2. Управління записами */}
                <Link to="/admin/appointments" style={cardStyle}>
                    <div style={{ fontSize: '30px' }}>📅</div>
                    <h3>Записи</h3>
                    <p>Перегляд всіх записів, зміна статусів.</p>
                </Link>

                {/* 3. Графік майстрів */}
                <Link to="/admin/schedule" style={cardStyle}>
                    <div style={{ fontSize: '30px' }}>👨‍🔧</div>
                    <h3>Графік та Майстри</h3>
                    <p>Управління персоналом та робочими годинами.</p>
                </Link>

                {/* 4. Користувачі */}
                <Link to="/admin/users" style={cardStyle}>
                    <div style={{ fontSize: '30px' }}>👥</div>
                    <h3>Клієнти</h3>
                    <p>Перегляд бази клієнтів.</p>
                </Link>

                 {/* 5. Звіти */}
                 <Link to="/admin/reports" style={cardStyle}>
                    <div style={{ fontSize: '30px' }}>📊</div>
                    <h3>Звіти</h3>
                    <p>Фінансова статистика та завантаженість.</p>
                </Link>
            </div>
        </div>
    );
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px'
};

const cardStyle = {
    display: 'block',
    padding: '20px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#333',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    textAlign: 'center'
};

export default AdminDashboard;