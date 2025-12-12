import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
    
    if (currentToken) {
      try {
        const decoded = jwtDecode(currentToken);
        setUserRole(decoded.role);
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        setToken(null);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show navbar at the top
          if (currentScrollY < 10) {
            setIsVisible(true);
          } 
          // Hide when scrolling down, show when scrolling up
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    setIsMenuOpen(false);
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/admin') {
      // Highlight admin link when on any admin route
      return location.pathname.startsWith('/admin');
    }
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🛠️</span>
          <span className="logo-text">СТО "Booking"</span>
        </Link>

        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="link-icon">🏠</span>
            <span className="link-text">Головна</span>
          </Link>

          {token ? (
            <>
              {userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`navbar-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="link-icon">⚙️</span>
                  <span className="link-text">Адмін-панель</span>
                </Link>
              )}

              <Link 
                to="/profile" 
                className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="link-icon">👤</span>
                <span className="link-text">Профіль</span>
              </Link>

              <Link 
                to="/my-appointments" 
                className={`navbar-link ${isActive('/my-appointments') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="link-icon">📂</span>
                <span className="link-text">Мої записи</span>
              </Link>

              <button 
                className="navbar-button"
                onClick={handleLogout}
              >
                <span className="link-icon">🚪</span>
                <span className="link-text">Вихід</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="link-icon">🔑</span>
                <span className="link-text">Вхід</span>
              </Link>

              <Link 
                to="/register" 
                className={`navbar-link register-link ${isActive('/register') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="link-icon">📝</span>
                <span className="link-text">Реєстрація</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

