const db = require("../config/db"); // Pool promise

// GET /todos

/**
 * @desc Get All Todos for authenticated user
 * @route /api/todos/
 * @method GET
 * @access Private (تتطلب تسجيل دخول)
 * @response
 *   200 : Array of todos belonging to the user
 *   401 : No token provided
 *   500 : Database or server error
 */
exports.getAllTodos = async (req, res) => {
  try {
    // ✅ نضيف شرط WHERE لجلب مهام المستخدم المسجل فقط
    const [rows] = await db.query(
      "SELECT * FROM task WHERE user_id = ? ORDER BY due_date ASC",
      [req.user.id],
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Create a todo for authenticated user
 * @method POST
 * @route /api/todos/
 * @access Private
 * @response
 *   201 : Todo created successfully
 *   400 : Validation error
 *   500 : Database or server error
 */
exports.createTodo = async (req, res) => {
  const { title, status, description, due_date, priority } = req.body;

  // ✅ نأخذ user_id من التوكن (لا نثق في البيانات القادمة من الـ Body)
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      // ✅ نضيف user_id في جملة الإدخال
      "INSERT INTO task (title, status, description, due_date, user_id, priority) VALUES (?,?,?,?,?,?)",
      [
        title,
        status ?? "not_completed",
        description,
        due_date,
        userId,
        priority,
      ],
    );

    res.status(201).json({
      message: "✅ The task was successfully created!",
      todo: {
        id: result.insertId,
        title,
        description,
        due_date,
        status: status ?? "not_completed",
        priority: priority,
        user_id: userId, // ✅ نرجعه للفرونت إند للتأكيد
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Update a todo (if owned by user)
 * @method PUT
 * @route /api/todos/:id
 * @access Private
 * @response
 *   200 : Todo updated successfully
 *   404 : Todo not found or not owned by user
 *   400 : Validation error
 *   500 : Server error
 */
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, due_date, status, priority } = req.body;
    const id = parseInt(req.params.id, 10);

    // 1️⃣ تحقق من وجود المهمة وَأنها تابعة للمستخدم الحالي
    const [existing] = await db.query(
      "SELECT * FROM task WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // 2️⃣ تحديث (نستخدم القيم القديمة إذا لم تُرسل جديدة)
    const [result] = await db.query(
      `UPDATE task 
       SET title = ?, description = ?, due_date = ?, status = ?, priority = ?
       WHERE id = ?`,
      [
        title ?? existing[0].title,
        description ?? existing[0].description,
        due_date ?? existing[0].due_date,
        status ?? existing[0].status,
        priority ?? existing[0].priority,
        id,
      ],
    );

    // 3️⃣ إعادة المهمة بعد التحديث
    const [updated] = await db.query("SELECT * FROM task WHERE id = ?", [id]);

    res.status(200).json({
      message: "Todo has been updated",
      todo: updated[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Get a todo by ID (if owned by user)
 * @method GET
 * @route /api/todos/:id
 * @access Private
 * @response
 *   200 : Todo fetched successfully
 *   404 : Todo not found or not owned by user
 *   500 : Server error
 */
exports.getSingleTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // ✅ نتحقق أن المهمة تابعة للمستخدم الحالي (شرط مزدوج)
    const [result] = await db.query(
      "SELECT * FROM task WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (result.length === 0) {
      // نرجع نفس الرسالة لحماية الخصوصية (لا نخبر المهاجم إذا كانت المهمة موجودة لكن ليست له)
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Delete a todo (if owned by user)
 * @method DELETE
 * @route /api/todos/:id
 * @access Private
 * @response
 *   200 : Todo deleted successfully
 *   404 : Todo not found or not owned by user
 *   500 : Database or server error
 */
exports.deleteTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // ✅ نحذف فقط إذا كانت المهمة موجودة وتابعة للمستخدم
    const [result] = await db.query(
      "DELETE FROM task WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
