const getCurrentUser = async (req, res) => {
  const { email, name, _id } = req.user;
  res.status(200).json({
    _id,
    email,
    name,
  });
};

module.exports = { getCurrentUser };
