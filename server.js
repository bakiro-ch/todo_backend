// require("dotenv").config();
// const app = require("./app"); 

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


//##########vercel:

// server.js
const app = require("./app");

// في بيئة Serverless مثل Vercel، لا نستخدم app.listen()
// نقوم بتصدير التطبيق ليتم التعامل معه بواسطة منصة Vercel
module.exports = app;