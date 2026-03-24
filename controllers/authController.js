const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ==========================================
// 🔹 تسجيل مستخدم جديد (Register)
// POST /api/auth/register
// ==========================================
const createWelcomeTodo = {
  // user_id: userId,
  title: "👋 Hello & Welcome!",
  description: "This is your first task. Start organizing your day! 🚀",
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // بعد أسبوع
  status: "not_completed",
  priority: "low",
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ msg: "Please fill in all fields." });

  try {
    // 1️⃣ التحقق من أن البريد الإلكتروني غير مسجل مسبقاً
    // ملاحظة: اسم الجدول 'user' كما أخبرتني سابقاً
    const [users] = await db.query("SELECT * FROM user WHERE email = ? ", [
      email,
    ]);

    if (users.length > 0) {
      return res
        .status(409)
        .json({ msg: "This email address is already registered." });
    }

    // 2️⃣ تشفير كلمة المرور (لا نحفظها كنص صريح أبداً)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ إدخال المستخدم الجديد في قاعدة البيانات
    const [result] = await db.query(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    // 4️⃣ إنشاء التوكن (JWT)
    const payload = { user: { id: result.insertId, name } };

    //create greet todo:
    const [greetTask] = await db.query(
      "INSERT INTO task (title, status, description, due_date, user_id, priority) VALUES (?,?,?,?,?,?)",
      [
        createWelcomeTodo.title,
        createWelcomeTodo.status ?? "not_completed",
        createWelcomeTodo.description,
        createWelcomeTodo.due_date,
        result.insertId,
        createWelcomeTodo.priority,
      ],
    );

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15d" }, // التوكن ينتهي بعد ساعة (يمكن تغييرها)
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          msg: "✅ Account created successfully",
          user: { id: result.insertId, name, email },
          todo: {
            id: greetTask.insertId,
            title: createWelcomeTodo.title,
            description: createWelcomeTodo.description,
            due_date: createWelcomeTodo.due_date,
            status: createWelcomeTodo.status ?? "not_completed",
            priority: createWelcomeTodo.priority,
            user_id: result.insertId,
            // ✅ نرجعه للفرونت إند للتأكيد
            // user_id: userId // ✅ نرجعه للفرونت إند للتأكيد
          },
        });
      },
    );
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
};

// ==========================================
// 🔹 تسجيل الدخول (Login)
// POST /api/auth/login
// ==========================================

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ التحقق من وجود البيانات المطلوبة
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter your email and password." });
  }

  try {
    // 1️⃣ البحث عن المستخدم بالبريد الإلكتروني
    const [users] = await db.query(
      "SELECT id, name, email, password FROM user WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({ msg: "Incorrect login details" });
    }

    const user = users[0];

    // 2️⃣ التحقق من صحة كلمة المرور (مقارنة النص المدخل مع المشفر في القاعدة)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect login details" });
    }

    // 3️⃣ إنشاء التوكن وإرساله
    const payload = { user: { id: user.id, name: user.name } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          msg: "✅ Login successful",
          user: { id: user.id, name: user.name, email: user.email },
        });
      },
    );
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};
