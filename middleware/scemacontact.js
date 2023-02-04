const Joi = require("joi");

const schemacontact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),

  phone: Joi.string()
    .required()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp("^[0-9]{3,30}$")),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  favorite: Joi.boolean(),
});

module.exports = { schemacontact };
