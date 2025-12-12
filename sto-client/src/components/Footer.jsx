import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-icon">🛠️</span>
              СТО "Booking"
            </h3>
            <p className="footer-description">
              Професійний сервіс для вашого автомобіля. Ми надаємо якісні послуги з ремонту та обслуговування транспортних засобів.
            </p>
            <div className="footer-social">
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
                <svg width="30" height="30" viewBox="0 0 32 32" className="social-svg">
                  <path d="M23.5445333,10.2885333 C23.0796444,10.5863111 22.0122666,11.0190222 21.4858666,11.0190222 L21.4858666,11.0199111 C20.8848,10.392 20.0385777,10 19.1000888,10 C17.2773333,10 15.7992889,11.4780444 15.7992889,13.3000888 C15.7992889,13.5532445 15.8286222,13.8001778 15.8828444,14.0369778 L15.8823111,14.0369778 C13.4097777,13.9720888 10.7056,12.7328 9.07768889,10.6117333 C8.0768,12.3441778 8.94293333,14.2709334 10.0787556,14.9729778 C9.68995555,15.0023111 8.97422222,14.9281778 8.63733333,14.5994666 C8.61475555,15.7493334 9.16764444,17.2728889 11.1836444,17.8256 C10.7953778,18.0344889 10.1080889,17.9745778 9.80924444,17.9301333 C9.91413329,18.9008 11.2734222,20.1697778 12.7598222,20.1697778 C12.2300445,20.7825777 10.2368,21.8940444 8,21.5404445 C9.51911111,22.4647111 11.2896,22.9999999 13.1635555,22.9999999 C18.4888889,22.9999999 22.6245334,18.6840889 22.4019555,13.3598222 C22.4010666,13.3539556 22.4010666,13.3480889 22.4005334,13.3416889 C22.4010666,13.328 22.4019555,13.3143111 22.4019555,13.3000888 C22.4019555,13.2835556 22.4005334,13.2679111 22.4,13.2519111 C22.8847999,12.9203555 23.5352888,12.3338667 24,11.5619556 C23.7304889,11.7104 22.9219555,12.0076445 22.1696,12.0814222 C22.6524444,11.8208 23.3678222,10.9672889 23.5445333,10.2885333 Z" fillRule="evenodd" fill="currentColor"></path>
                </svg>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <svg width="30" height="30" viewBox="0 0 32 32" className="social-svg">
                  <path d="M24.8319297,11.4874563 C24.6803369,10.1603684 24.3639692,9.77357894 24.1398754,9.59352174 C23.7839619,9.31343284 23.1380446,9.21340113 22.2746246,9.15338207 C20.8905163,9.06001905 18.537532,9 16,9 C13.455877,9 11.1094837,9.05335028 9.72537529,9.15338207 C8.86195533,9.21340113 8.21603808,9.31343284 7.8601245,9.59352174 C7.63603076,9.77357894 7.32625412,10.1603684 7.1680703,11.4874563 C6.94397657,13.4013973 6.94397657,17.7627818 7.1680703,19.6767227 C7.32625412,21.0038107 7.63603076,21.3906002 7.8601245,21.5706573 C8.21603808,21.8507463 8.86195533,21.950778 9.72537529,22.0107971 C11.1094837,22.1041601 13.455877,22.164179 16,22.164179 C18.544123,22.164179 20.8905163,22.1041601 22.2746246,22.0107971 C23.1380446,21.950778 23.7839619,21.8507463 24.1398754,21.5706573 C24.3639692,21.3972689 24.6737458,21.0038107 24.8319297,19.6767227 C25.0560234,17.7627818 25.0560234,13.4013973 24.8319297,11.4874563 Z M13.8249725,18.4429978 L13.8249725,12.7145125 L19.2559502,15.5754208 L13.8249725,18.4429978 Z" fillRule="evenodd" fill="currentColor"></path>
                </svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <svg width="30" height="30" viewBox="0 0 32 32" className="social-svg">
                  <path d="M13.6383 25H16.9133V16.0044H19.3702L19.8561 13.1936H16.9133V11.1568C16.9133 10.5002 17.3379 9.8108 17.9447 9.8108H19.6171V7H17.5674V7.0126C14.3604 7.129 13.7014 8.9864 13.6443 10.9374H13.6383V13.1936H12V16.0044H13.6383V25Z" fillRule="evenodd" fill="currentColor"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <svg width="30" height="30" viewBox="0 0 32 32" className="social-svg">
                  <path d="M12.7045454,8 C10.1221593,8 8,10.1193185 8,12.7045454 L8,19.2954545 C8,21.8778407 10.1193185,24 12.7045454,24 L19.2954545,24 C21.8778407,24 24,21.8806822 24,19.2954545 L24,12.7045454 C24,10.1221593 21.8806822,8 19.2954545,8 L12.7045454,8 Z M12.7045454,9.45454545 L19.2954545,9.45454545 C21.0937498,9.45454545 22.5454545,10.9062502 22.5454545,12.7045454 L22.5454545,19.2954545 C22.5454545,21.0937498 21.0937498,22.5454545 19.2954545,22.5454545 L12.7045454,22.5454545 C10.9062502,22.5454545 9.45454545,21.0937498 9.45454545,19.2954545 L9.45454545,12.7045454 C9.45454545,10.9062502 10.9062502,9.45454545 12.7045454,9.45454545 Z M20.2954545,11.0454545 C19.9289774,11.0454545 19.6363636,11.3380684 19.6363636,11.7045454 C19.6363636,12.0710225 19.9289774,12.3636364 20.2954545,12.3636364 C20.6619316,12.3636364 20.9545454,12.0710225 20.9545454,11.7045454 C20.9545454,11.3380684 20.6619316,11.0454545 20.2954545,11.0454545 Z M16,11.6363636 C13.599432,11.6363636 11.6363636,13.599432 11.6363636,16 C11.6363636,18.400568 13.599432,20.3636364 16,20.3636364 C18.400568,20.3636364 20.3636364,18.400568 20.3636364,16 C20.3636364,13.599432 18.400568,11.6363636 16,11.6363636 Z M16,13.0909091 C17.6164771,13.0909091 18.9090909,14.3835229 18.9090909,16 C18.9090909,17.6164771 17.6164771,18.9090909 16,18.9090909 C14.3835229,18.9090909 13.0909091,17.6164771 13.0909091,16 C13.0909091,14.3835229 14.3835229,13.0909091 16,13.0909091 Z" fillRule="evenodd" fill="currentColor"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Швидкі посилання</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Головна</Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">Вхід</Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">Реєстрація</Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">Профіль</Link>
              </li>
              <li>
                <Link to="/my-appointments" className="footer-link">Мої записи</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Контакти</h4>
            <ul className="footer-contact">
              <li className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-text">
                  вул. Автомобільна, 15<br />
                  м. Київ, 01001
                </span>
              </li>
              <li className="contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:+380501234567" className="contact-link">
                  +38 (050) 123-45-67
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon">📧</span>
                <a href="mailto:info@stobooking.com" className="contact-link">
                  info@stobooking.com
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon">🕒</span>
                <span className="contact-text">
                  Пн-Пт: 08:00 - 20:00<br />
                  Сб-Нд: 09:00 - 18:00
                </span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Наші послуги</h4>
            <ul className="footer-links">
              <li>
                <a href="/#services" className="footer-link">Ремонт двигуна</a>
              </li>
              <li>
                <a href="/#services" className="footer-link">Заміна масла</a>
              </li>
              <li>
                <a href="/#services" className="footer-link">Ремонт гальм</a>
              </li>
              <li>
                <a href="/#services" className="footer-link">Шиномонтаж</a>
              </li>
              <li>
                <a href="/#services" className="footer-link">Діагностика</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} СТО "Booking". Всі права захищені.
          </p>
          <div className="footer-legal">
            <a href="#privacy" className="footer-legal-link">Політика конфіденційності</a>
            <span className="footer-separator">|</span>
            <a href="#terms" className="footer-legal-link">Умови використання</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
