const express = require("express");
const router = express.Router();

const todoController = require("../controllers/todoController");
const validate = require("../middlewares/validate")
const schema = require("../validations/todoSchema");

// مجرد أمثلة على الراوتس بدون منطق حقيقي
router.get("/", todoController.getAllTodos);

router.get("/:id",validate(schema.idSchema,"params"), todoController.getSingleTodo);

router.post("/",validate(schema.todoPostSchema,"body"), todoController.createTodo);

router.put('/:id',
  validate(schema.idSchema, "params"),       // ← للتحقق من id
  validate(schema.todoPutSchema, "body"),    // ← للتحقق من body
  todoController.updateTodo
);

router.delete("/:id",validate(schema.idSchema,"params"),todoController.deleteTodo)

module.exports = router;
