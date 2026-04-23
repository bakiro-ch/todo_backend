require("dotenv").config();
const mysql = require("mysql2/promise"); // استخدم promise مباشرة لتبسيط الكود

// دالة لجلب الشهادة: إما من متغير البيئة (لـ Vercel) أو من الملف (للتطوير المحلي)
const getCaCert = () => {
  if (process.env.DB_CA_CERT) {
    // إذا كان المتغير موجوداً (في Vercel)، استخدمه مباشرة
    return process.env.DB_CA_CERT;
  } else if (process.env.DB_CA_PATH) {
    // إذا كنت تعمل محلياً ولديك ملف، اقرأه
    const fs = require('fs');
    const path = require('path');
    return fs.readFileSync(path.resolve(__dirname, process.env.TIDB_CA_PATH));
  }
  return undefined;
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // تأكد أن الاسم مطابق لما في .env و Vercel
  port: parseInt(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca: getCaCert(),                 // هنا نمرر الشهادة كنص أو Buffer
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000
});

// اختبار الاتصال
pool.getConnection()
  .then(connection => {
    console.log("✅ Connected to TiDB Cloud Successfully!");
    connection.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
    console.error("Error Code:", err.code);
  });

module.exports = pool;