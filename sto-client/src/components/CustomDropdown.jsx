import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, placeholder, label, required, white = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option) => {
    const event = { target: { name: 'selected', value: option.value } };
    onChange(event);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      {label && (
        <label className={`dropdown-label ${white ? 'white' : ''}`}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`dropdown-toggle ${white ? 'white' : ''} ${isOpen ? 'open' : ''} ${!selectedOption ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dropdown-selected">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.length > 5 && (
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Пошук..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dropdown-search-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`dropdown-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="dropdown-no-results">Нічого не знайдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

