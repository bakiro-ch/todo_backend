const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1️⃣ قراءة التوكن من الهيدر
  // ملاحظة: يجب أن يرسل الفرونت إند هذا الهيدر مع كل طلب محمي

  const token = req.header("x-auth-token");
  // 2️⃣ التحقق من وجود التوكن

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied." });
  }

  try {
    // 3️⃣ التحقق من صحة التوكن وفك تشفيره باستخدام المفتاح السري

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4️⃣ إضافة بيانات المستخدم (الأي دي) للطلب
    // الآن أي كونترولر يستقبل هذا الطلب يمكنه معرفة من هو المستخدم عبر req.user.id

    req.user = decoded.user;
    // 5️⃣ المتابعة للخطوة التالية (الكونترولر)

    next();
  } catch (err) {
    // إذا كان التوكن منتهي الصلاحية أو غير صحيح

    res.status(401).json({ msg: "The token is invalid." });
  }
};
