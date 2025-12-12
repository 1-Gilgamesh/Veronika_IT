import React, { useState, useEffect } from 'react';
import './CustomCalendar.css';

const CustomCalendar = ({ value, onChange, label, required, white = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sync with value prop
  useEffect(() => {
    if (value) {
      // Parse datetime-local format (YYYY-MM-DDTHH:mm) as local time
      // Split to avoid timezone conversion issues
      const [datePart, timePart] = value.split('T');
      if (datePart && timePart) {
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const date = new Date(year, month - 1, day, hours, minutes);
        setSelectedDate(date);
        setSelectedTime(timePart.slice(0, 5)); // HH:mm format
      }
    } else {
      setSelectedDate(null);
      setSelectedTime('');
    }
  }, [value]);

  const months = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date) => {
    if (!date || isPast(date)) return;
    setSelectedDate(date);
    // If time is already selected, update immediately
    if (selectedTime) {
      updateDateTime(date, selectedTime);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      updateDateTime(selectedDate, time);
    }
  };

  const updateDateTime = (date, time) => {
    const [hours, minutes] = time.split(':');
    // Create date in local timezone
    const datetime = new Date(date);
    datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Convert to ISO string format for datetime-local input (YYYY-MM-DDTHH:mm)
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    const hour = String(datetime.getHours()).padStart(2, '0');
    const minute = String(datetime.getMinutes()).padStart(2, '0');
    const isoString = `${year}-${month}-${day}T${hour}:${minute}`;
    
    onChange({ target: { name: 'datetime', value: isoString } });
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      updateDateTime(selectedDate, selectedTime);
      setIsOpen(false);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    // Parse datetime-local format as local time
    const [datePart, timePart] = value.split('T');
    if (datePart && timePart) {
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      const date = new Date(year, month - 1, day, hours, minutes);
      return date.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return '';
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const days = getDaysInMonth(currentMonth);
  const timeSlots = generateTimeSlots();

  return (
    <div className="custom-calendar">
      {label && (
        <label className={`calendar-label ${white ? 'white' : ''}`}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`calendar-toggle ${white ? 'white' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="calendar-icon">📅</span>
        <span className="calendar-value">
          {formatDisplayValue() || 'Оберіть дату та час'}
        </span>
        <span className="calendar-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="calendar-popup">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
            <h3 className="calendar-month">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="calendar-grid">
            {weekDays.map(day => (
              <div key={day} className="calendar-weekday">{day}</div>
            ))}
            {days.map((date, index) => (
              <div
                key={index}
                className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${isPast(date) ? 'past' : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                {date ? date.getDate() : ''}
              </div>
            ))}
          </div>

          {selectedDate && (
            <div className="calendar-time-section">
              <h4 className="time-section-title">Оберіть час:</h4>
              <div className="time-slots">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="calendar-actions">
            <button
              type="button"
              className="calendar-cancel"
              onClick={() => setIsOpen(false)}
            >
              Скасувати
            </button>
            <button
              type="button"
              className="calendar-confirm"
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
            >
              Підтвердити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;

