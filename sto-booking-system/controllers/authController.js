const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');
require('dotenv').config();

// Генерація токена (функція-помічник)
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '24h' // Токен діє 24 години
    });
};

// 1. РЕЄСТРАЦІЯ (Тільки для клієнтів)
exports.register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Перевірка: чи заповнені поля
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: 'Всі поля обов\'язкові' });
        }

        // Перевірка: чи є вже такий email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        // Хешування пароля (безпека)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Створення користувача
        const newUser = await User.create({
            full_name,
            email,
            password_hash: hashedPassword,
            role: 'client' // За замовчуванням всі - клієнти
        });

        // Одразу видаємо токен, щоб не треба було логінитись після реєстрації
        const token = generateToken(newUser.id, newUser.role);

        res.status(201).json({ 
            message: 'Користувача успішно зареєстровано',
            token,
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера при реєстрації' });
    }
};

// 2. ЛОГІН (Вхід у систему)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Шукаємо користувача
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }

        // Перевіряємо пароль (порівнюємо введений з хешем у БД)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }

        // Якщо все ок - видаємо токен
        const token = generateToken(user.id, user.role);

        res.json({
            message: 'Вхід успішний',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера при вході' });
    }
};

// 3. ОНОВЛЕННЯ ПРОФІЛЮ (PUT)
exports.updateProfile = async (req, res) => {
    try {
        const { full_name, email } = req.body;
        const userId = req.user.id; // Беремо ID з токена

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        // Оновлюємо поля
        user.full_name = full_name || user.full_name;
        user.email = email || user.email;
        
        await user.save();

        res.json({ message: 'Профіль оновлено успішно', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка оновлення профілю' });
    }
};

// 4. ОТРИМАТИ ДАНІ ПРОФІЛЮ (GET)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'full_name', 'email', 'role'] // Пароль не віддаємо!
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};