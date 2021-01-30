const Joi = require('@hapi/joi');

exports.validator = Joi.object({
  rule: Joi.object({
    field: Joi.string().required(),
    condition: Joi.string().required(),
    condition_value: Joi.any().required(),
  }).required(),

  data: Joi.any().required(),
});