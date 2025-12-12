import React, { useState } from 'react';
import axios from '../../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Notification from '../../components/Notification';
import './AdminShared.css';

const AdminReports = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const [filters, setFilters] = useState({
        startDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        endDate: formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
        type: 'services'
    });

    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/reports`, { params: filters });
            setReportData(res.data);
            if (res.data.length === 0) {
                setNotification({ message: 'Даних за цей період немає', type: 'info' });
            }
        } catch (err) {
            setNotification({ message: 'Помилка отримання даних', type: 'error' });
        }
        setLoading(false);
    };

    const transliterate = (text) => {
        const u = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
            'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
            'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
            'ь': '', 'ю': 'yu', 'я': 'ya',
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh', 'З': 'Z',
            'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
            'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
            'Ь': '', 'Ю': 'Yu', 'Я': 'Ya'
        };
        return text.split('').map(char => u[char] || char).join('');
    };

    const exportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("STO Booking Report", 14, 22);
            
            doc.setFontSize(11);
            doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, 30);
            doc.text(`Type: ${filters.type === 'services' ? 'Services Revenue' : 'Masters Workload'}`, 14, 36);

            const tableColumn = ["Name", "Count", "Revenue (UAH)"];
            const tableRows = [];
            let totalRevenue = 0;

            reportData.forEach(item => {
                const safeName = transliterate(item.name);
                const rowData = [safeName, item.count, item.revenue.toFixed(2)];
                tableRows.push(rowData);
                totalRevenue += item.revenue;
            });

            tableRows.push(["TOTAL", "", totalRevenue.toFixed(2)]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 45,
            });

            doc.save(`report.pdf`);
            setNotification({ message: '✅ PDF звіт завантажено!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Помилка створення PDF', type: 'error' });
        }
    };

    const totalCount = reportData.reduce((acc, curr) => acc + curr.count, 0);
    const totalRevenue = reportData.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>📊 Аналітичні звіти</h1>
            </div>

            <div className="admin-card">
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Параметри звіту</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555' }}>
                            Тип звіту:
                        </label>
                        <select
                            value={filters.type}
                            onChange={e => setFilters({...filters, type: e.target.value})}
                            className="admin-select"
                        >
                            <option value="services">💰 Послуги та Прибуток</option>
                            <option value="masters">👨‍🔧 Завантаженість майстрів</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555' }}>
                            З:
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={e => setFilters({...filters, startDate: e.target.value})}
                            className="admin-input"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555' }}>
                            По:
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={e => setFilters({...filters, endDate: e.target.value})}
                            className="admin-input"
                        />
                    </div>
                </div>

                <button onClick={handleGenerate} className="admin-button admin-button-primary" disabled={loading}>
                    {loading ? 'Завантаження...' : '🔍 Сформувати звіт'}
                </button>
            </div>

            {reportData.length > 0 && (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#333' }}>
                                Результати ({filters.startDate} - {filters.endDate})
                            </h3>
                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                {filters.type === 'services' ? 'Послуги та прибуток' : 'Завантаженість майстрів'}
                            </p>
                        </div>
                        <button onClick={exportPDF} className="admin-button admin-button-danger">
                            📄 Завантажити PDF
                        </button>
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Назва / Ім'я</th>
                                <th style={{ textAlign: 'center' }}>Кількість</th>
                                <th style={{ textAlign: 'right' }}>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row, index) => (
                                <tr key={index}>
                                    <td><strong>{row.name}</strong></td>
                                    <td style={{ textAlign: 'center' }}>{row.count}</td>
                                    <td style={{ textAlign: 'right' }}><strong>{row.revenue.toFixed(2)} грн</strong></td>
                                </tr>
                            ))}
                            <tr style={{ background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)', fontWeight: 'bold' }}>
                                <td>ВСЬОГО:</td>
                                <td style={{ textAlign: 'center' }}>{totalCount}</td>
                                <td style={{ textAlign: 'right' }}>{totalRevenue.toFixed(2)} грн</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {reportData.length === 0 && !loading && (
                <div className="admin-card">
                    <div className="admin-empty">
                        Даних за цей період немає або ви ще не натиснули "Сформувати звіт".
                    </div>
                </div>
            )}

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default AdminReports;
