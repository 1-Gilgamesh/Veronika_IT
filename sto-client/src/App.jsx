import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAppointments from './pages/MyAppointments'; // Імпортуємо нову сторінку
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const token = localStorage.getItem('token');
  let userRole = null;

  // Спробуємо розшифрувати токен, щоб дізнатися роль
  if (token) {
      try {
          const decoded = jwtDecode(token);
          userRole = decoded.role; // 'admin' або 'client'
      } catch (e) {
          console.error("Invalid token");
          localStorage.removeItem('token');
      }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

return (
    <Router>
      <nav style={{ background: '#333', padding: '1rem', color: '#fff', marginBottom: '20px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
            🛠️ СТО "Booking"
          </Link>

          <div style={{ display: 'flex', gap: '20px' }}>
             <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Головна</Link>
             
             {token ? (
               <>
                 {/* ПОКАЗУЄМО ЦЕ ТІЛЬКИ АДМІНУ */}
                 {userRole === 'admin' && (
                    <Link to="/admin" style={{ color: '#ff4d4d', fontWeight: 'bold', textDecoration: 'none' }}>⚙️ Адмін-панель</Link>
                 )}

                 <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>👤 Профіль</Link>
                 <Link to="/my-appointments" style={{ color: '#ffd700', textDecoration: 'none' }}>📂 Мої записи</Link>
                 <button 
                    onClick={handleLogout} 
                    style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                 >
                   Вихід
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Вхід</Link>
                 <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Реєстрація</Link>
               </>
             )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/my-appointments" element={token ? <MyAppointments /> : <Navigate to="/login" />} />

        {/* ЗАХИЩЕНИЙ МАРШРУТ АДМІНА */}
        <Route path="/admin" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        
        {/* Тут ми будемо додавати під-маршрути: /admin/services, /admin/users тощо */}
        <Route path="/admin/services" element={userRole === 'admin' ? <AdminServices /> : <Navigate to="/" />} />
        <Route path="/admin/appointments" element={userRole === 'admin' ? <AdminAppointments /> : <Navigate to="/" />} />
        <Route path="/admin/schedule" element={userRole === 'admin' ? <AdminSchedule /> : <Navigate to="/" />} />
        <Route path="/admin/reports" element={userRole === 'admin' ? <AdminReports /> : <Navigate to="/" />} />
        <Route path="/admin/users" element={userRole === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;