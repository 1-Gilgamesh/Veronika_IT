import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const adminCards = [
        {
            to: '/admin/services',
            icon: '🛠️',
            title: 'Послуги',
            description: 'Додати, редагувати або видалити послуги та ціни',
            color: 'services'
        },
        {
            to: '/admin/appointments',
            icon: '📅',
            title: 'Записи',
            description: 'Перегляд всіх записів, зміна статусів',
            color: 'appointments'
        },
        {
            to: '/admin/schedule',
            icon: '👨‍🔧',
            title: 'Графік та Майстри',
            description: 'Управління персоналом та робочими годинами',
            color: 'schedule'
        },
        {
            to: '/admin/users',
            icon: '👥',
            title: 'Клієнти',
            description: 'Перегляд бази клієнтів',
            color: 'users'
        },
        {
            to: '/admin/reports',
            icon: '📊',
            title: 'Звіти',
            description: 'Фінансова статистика та завантаженість',
            color: 'reports'
        }
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>⚙️ Панель Адміністратора</h1>
                <p className="admin-subtitle">Вітаємо в системі управління СТО</p>
            </div>

            <div className="admin-cards-grid">
                {adminCards.map((card, index) => (
                    <Link 
                        key={card.to} 
                        to={card.to} 
                        className={`admin-card admin-card-${card.color}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="admin-card-icon">{card.icon}</div>
                        <h3 className="admin-card-title">{card.title}</h3>
                        <p className="admin-card-description">{card.description}</p>
                        <div className="admin-card-arrow">→</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
