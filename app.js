const express = require("express");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/auth"); // ✅ 1. استيراد مسارات المصادقة
const authMiddleware = require("./middlewares/auth"); // ✅ 2. استيراد ميدلوير الحماية
const cors = require('cors'); // ✅ تأكد من تثبيتها: npm install cors

const app = express();

// ✅ إعداد CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // ديناميكي للإنتاج
    credentials: true, // للسماح بإرسال الكوكيز والتوكنز
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Middleware
app.use(express.json());

// Routes

// ✅ 3. مسارات المصادقة (عامة - لا تحتاج حماية)
// الوصول لها سيكون: /api/auth/register و /api/auth/login

app.use("/api/auth",authRoutes)

// ✅ 4. مسارات التودو (محمية - تتطلب توكن)
// نضع authMiddleware قبل todoRoutes ليتم التحقق أولاً
app.use("/api/todos",authMiddleware , todoRoutes);


module.exports = app;
