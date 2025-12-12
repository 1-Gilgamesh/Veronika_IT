import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import './App.css';

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

return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <main className="main-content-wrapper">
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
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;