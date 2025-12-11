import React, { useState } from 'react';
import axios from '../../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <--- 1. ЗМІНЕНО ІМПОРТ

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

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/reports`, { params: filters });
            setReportData(res.data);
        } catch (err) {
            console.error(err);
            alert('Помилка отримання даних. Перевірте, чи запущено сервер.');
        }
        setLoading(false);
    };

    // Транслітерація (щоб PDF відображав текст англійськими літерами)
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

            // Заголовок
            doc.setFontSize(18);
            doc.text("STO Booking Report", 14, 22);
            
            doc.setFontSize(11);
            doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, 30);
            doc.text(`Type: ${filters.type === 'services' ? 'Services Revenue' : 'Masters Workload'}`, 14, 36);

            // Підготовка даних
            const tableColumn = ["Name", "Count", "Revenue (UAH)"];
            const tableRows = [];
            let totalRevenue = 0;

            reportData.forEach(item => {
                const safeName = transliterate(item.name);
                
                const rowData = [
                    safeName, 
                    item.count, 
                    item.revenue.toFixed(2)
                ];
                tableRows.push(rowData);
                totalRevenue += item.revenue;
            });

            tableRows.push(["TOTAL", "", totalRevenue.toFixed(2)]);

            // <--- 2. ЗМІНЕНО ВИКЛИК ФУНКЦІЇ (передаємо doc першим параметром)
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 45,
            });

            doc.save(`report.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
            alert("Помилка створення PDF");
        }
    };

    return (
        <div className="container">
            <h1>📊 Аналітичні звіти</h1>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Тип звіту:</label>
                    <select 
                        value={filters.type}
                        onChange={e => setFilters({...filters, type: e.target.value})}
                        style={inputStyle}
                    >
                        <option value="services">💰 Послуги та Прибуток</option>
                        <option value="masters">👨‍🔧 Завантаженість майстрів</option>
                    </select>
                </div>

                <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>З:</label>
                    <input 
                        type="date" 
                        value={filters.startDate} 
                        onChange={e => setFilters({...filters, startDate: e.target.value})} 
                        style={inputStyle} 
                    />
                </div>

                <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>По:</label>
                    <input 
                        type="date" 
                        value={filters.endDate} 
                        onChange={e => setFilters({...filters, endDate: e.target.value})} 
                        style={inputStyle} 
                    />
                </div>

                <button onClick={handleGenerate} style={btnStyle}>🔍 Сформувати</button>
            </div>

            {reportData.length > 0 ? (
                <div style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Результати ({filters.startDate} - {filters.endDate})</h2>
                        <button onClick={exportPDF} style={{...btnStyle, background: '#dc3545'}}>📄 Завантажити PDF</button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #ddd' }}>
                        <thead>
                            <tr style={{ background: '#343a40', color: '#fff' }}>
                                <th style={thStyle}>Назва / Ім'я</th>
                                <th style={thStyle}>Кількість</th>
                                <th style={thStyle}>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((row, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={tdStyle}>{row.name}</td>
                                    <td style={tdStyle}>{row.count}</td>
                                    <td style={tdStyle}>{row.revenue.toFixed(2)} грн</td>
                                </tr>
                            ))}
                            <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                                <td style={tdStyle}>ВСЬОГО:</td>
                                <td style={tdStyle}>{reportData.reduce((acc, curr) => acc + curr.count, 0)}</td>
                                <td style={tdStyle}>{reportData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)} грн</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ marginTop: '20px', color: '#666' }}>
                    {loading ? 'Завантаження...' : 'Даних за цей період немає або ви ще не натиснули "Сформувати".'}
                </div>
            )}
        </div>
    );
};

// Стилі
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' };
const btnStyle = { padding: '9px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const thStyle = { padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px' };

export default AdminReports;