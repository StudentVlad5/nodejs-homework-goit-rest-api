const Joi = require("joi");

const schemauserRegistration = Joi.object({
  password: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  name: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const schemauserLogin = Joi.object({
  password: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const scemaSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

module.exports = {
  schemauserRegistration,
  schemauserLogin,
  scemaSubscription,
};
