const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const { UserSchema } = require("../models/user");

const signupController = async (req, res) => {
  const { name, email, password } = req.body;
  const avatarURL = gravatar.url(email);
  const user = new UserSchema({ name, email, password, avatarURL });
  const token = jsonwebtoken.sign(
    {
      id: user._id,
    },
    process.env.JSONWEBTOKEN_SECRET,
    { expiresIn: "1h" }
  );
  user.token = token;
  await user.save();
  return res
    .status(201)
    .json(
      `successful authorization for token: ${token}, email: ${user.email}, subscription: ${user.subscription}, avatarURL: ${avatarURL}`
    );
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json(`Credential is wrong`);
  }

  const token = jsonwebtoken.sign(
    {
      id: user._id,
    },
    process.env.JSONWEBTOKEN_SECRET,
    { expiresIn: "1h" }
  );
  await UserSchema.findByIdAndUpdate(user._id, { token });
  return res
    .status(200)
    .json(
      `successful authorization for token: ${token}, email: ${user.email}, subscription: ${user.subscription}`
    );
};

const logoutController = async (req, res) => {
  const { _id } = req.user;
  await UserSchema.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

module.exports = {
  signupController,
  loginController,
  logoutController,
};
