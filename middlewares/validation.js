const { celebrate, Joi } = require("celebrate");

const validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30),
  }),
});

const validateCreateExerciseBody = celebrate({
  body: Joi.object().keys({
    id: Joi.string(),
    description: Joi.string().required().min(2),
    duration: Joi.number().required(),
    date: Joi.string().allow('').optional(),
  }),
});

module.exports = {
  validateCreateExerciseBody,
  validateCreateUserBody,
};
