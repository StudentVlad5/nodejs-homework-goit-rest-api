const validation = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "missing fields" });
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };
};
module.exports = { validation };
