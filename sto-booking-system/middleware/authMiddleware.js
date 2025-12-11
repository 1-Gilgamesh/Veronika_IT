const jwt = require('jsonwebtoken');
require('dotenv').config();

// Перевірка: чи користувач взагалі залогінений
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        // Отримуємо токен із заголовка Authorization
        // Формат: "Bearer eyJhbGciOiJIUzI1Ni..."
        const tokenHeader = req.headers.authorization;
        
        if (!tokenHeader) {
            return res.status(401).json({ message: "Користувач не авторизований (немає токена)" });
        }

        // Відрізаємо слово "Bearer " (перші 7 символів), щоб отримати чистий токен
        const token = tokenHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ message: "Невірний формат токена" });
        }

        // Розшифровуємо токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Додаємо дані користувача (id, role) до запиту, щоб використати далі
        req.user = decoded;
        
        next(); // Пропускаємо далі до контролера
    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: "Токен не дійсний або сплив термін дії" });
    }
};