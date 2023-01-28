const Joi = require("joi");

const schemaPut = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),

  phone: Joi.string()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp("^[0-9]{3,30}$")),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

module.exports = { schemaPut };
