require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const db = pool.promise();

// اختبار الاتصال عند تشغيل السيرفر
db.query("SELECT 1")
  .then(() => console.log("✅ Connected to MySQL (Pool)"))
  .catch((err) => console.log("❌ Database connection failed:", err));

module.exports = db;
