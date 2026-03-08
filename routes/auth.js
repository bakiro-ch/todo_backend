const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// ==========================================
// 🔹 مسار التسجيل (Register)
// POST /api/auth/register
// ==========================================
 router.post("/register",register);

 // ==========================================
// 🔹 مسار تسجيل الدخول (Login)
// POST /api/auth/login
// ==========================================

router.post("/login",login);

// ✅ تصدير الراوتر (هذا السطر هو الأهم!)
module.exports = router;