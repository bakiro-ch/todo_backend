const Joi = require("joi");

exports.todoPostSchema = Joi.object({
  title: Joi.string().trim().max(150).required(),
  description: Joi.string().trim().max(500).optional(),
  due_date: Joi.date().optional(),
  status: Joi.string()
    .trim()
    .min(3)
    .max(10)
    .valid("not_completed", "completed")
    .default("not_completed")
    .optional(),
  priority: Joi.string()
    .valid("high", "low", "medium")
    .default("medium")
    .optional(),
});

exports.todoPutSchema = Joi.object({
  title: Joi.string().trim().max(150).optional(),
  description: Joi.string().trim().max(500).optional(),
  due_date: Joi.date().optional(),
  status: Joi.string()
    .trim()
    .min(3)
    .max(10)
    .valid("not_completed", "completed")
    .optional(),
  priority: Joi.string()
    .valid("high", "low", "medium")
    .default("medium")
    .optional(),
});

exports.idSchema = Joi.object({
  id: Joi.number().integer().min(1000).required(),
});
