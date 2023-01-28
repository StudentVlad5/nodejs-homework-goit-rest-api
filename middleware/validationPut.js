const validationPut = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "missing fields" });
    }
    const { name, email, phone } = req.body;
    const { error } = schema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error });
    }
    next();
  };
};
module.exports = { validationPut };
