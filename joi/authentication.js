const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().lowercase().required(),
  phoneNumber: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
};
