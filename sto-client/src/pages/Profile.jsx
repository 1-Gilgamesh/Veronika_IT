import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({ full_name: '', email: '', role: '' });
    const [originalData, setOriginalData] = useState({ full_name: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/auth/profile');
            setUserData(res.data);
            setOriginalData({ full_name: res.data.full_name, email: res.data.email });
        } catch (err) {
            console.error(err);
            setMessage('❌ Помилка завантаження профілю');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setMessage('');
    };

    const handleCancel = () => {
        setUserData({ ...userData, full_name: originalData.full_name, email: originalData.email });
        setIsEditing(false);
        setMessage('');
    };

    const handleSaveClick = () => {
        // Check if data has changed
        if (userData.full_name === originalData.full_name && userData.email === originalData.email) {
            setIsEditing(false);
            return;
        }
        setShowModal(true);
    };

    const handleConfirmSave = async () => {
        setShowModal(false);
        setSaving(true);
        setMessage('');

        try {
            await axios.put('/auth/profile', {
                full_name: userData.full_name,
                email: userData.email
            });
            setOriginalData({ full_name: userData.full_name, email: userData.email });
            setIsEditing(false);
            setMessage('✅ Дані успішно збережено!');
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setMessage('❌ Помилка оновлення профілю');
        } finally {
            setSaving(false);
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    const getInitials = (name) => {
        if (!name) return '👤';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <div className="loading">Завантаження профілю...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {getInitials(userData.full_name)}
                    </div>
                    <h1>Мій профіль</h1>
                </div>

                {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                {!isEditing ? (
                    <>
                        <div className="profile-info">
                            <div className="info-item">
                                <div className="info-label">
                                    <span>👤</span>
                                    Ім'я та Прізвище
                                </div>
                                <div className={`info-value ${!userData.full_name ? 'empty' : ''}`}>
                                    {userData.full_name || 'Не вказано'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">
                                    <span>📧</span>
                                    Email
                                </div>
                                <div className={`info-value ${!userData.email ? 'empty' : ''}`}>
                                    {userData.email || 'Не вказано'}
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-label">
                                    <span>🔑</span>
                                    Роль
                                </div>
                                <div className="info-value">
                                    {userData.role === 'admin' ? 'Адміністратор' : 'Клієнт'}
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button 
                                className="profile-button edit"
                                onClick={handleEdit}
                            >
                                <span>✏️</span>
                                <span>Редагувати дані</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
                            <div className="form-group">
                                <label htmlFor="full_name">
                                    <span>👤</span>
                                    Ім'я та Прізвище
                                </label>
                                <input
                                    id="full_name"
                                    type="text"
                                    className="form-input"
                                    value={userData.full_name}
                                    onChange={e => setUserData({...userData, full_name: e.target.value})}
                                    placeholder="Введіть ваше ім'я та прізвище"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <span>📧</span>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-input"
                                    value={userData.email}
                                    onChange={e => setUserData({...userData, email: e.target.value})}
                                    placeholder="your.email@example.com"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="profile-button cancel"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    <span>❌</span>
                                    <span>Скасувати</span>
                                </button>
                                <button
                                    type="submit"
                                    className="profile-button save"
                                    disabled={saving}
                                >
                                    <span>{saving ? '⏳' : '💾'}</span>
                                    <span>{saving ? 'Збереження...' : 'Зберегти зміни'}</span>
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleModalCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon">⚠️</div>
                            <h3>Підтвердження змін</h3>
                            <p>Чи ви впевнені що хочете внести зміни у персональні дані?</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-button cancel"
                                onClick={handleModalCancel}
                            >
                                Скасувати
                            </button>
                            <button
                                className="modal-button confirm"
                                onClick={handleConfirmSave}
                            >
                                Підтвердити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;