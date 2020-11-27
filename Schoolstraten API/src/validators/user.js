const Joi = require("@hapi/joi");

function registerValidator(body) {
  const registerValidatorSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return registerValidatorSchema.validate(body);
}

function loginValidator(body) {
  const loginValidatorSchema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6),
  });
  return loginValidatorSchema.validate(body);
}

module.exports = { registerValidator, loginValidator };
