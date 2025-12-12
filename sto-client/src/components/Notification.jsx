import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`} onClick={onClose}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
        </div>
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Notification;

