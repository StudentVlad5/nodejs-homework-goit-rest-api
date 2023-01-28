const validationPost = (schema) => {
  return (req, res, next) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const { error } = schema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error });
    }
    next();
  };
};
module.exports = { validationPost };
