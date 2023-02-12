const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const sgMail = require("@sendgrid/mail");
const { uuid } = require("uuidv4");
const validator = require("email-validator");
const { UserSchema } = require("../models/user");
const { VerificationSchema } = require("../models/verification");

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

  const code = uuid();
  const verification = new VerificationSchema({
    code,
    userID: user._id,
  });
  await verification.save();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: "vlad_np@ukr.net", // Change to your verified sender
    subject: "Thank you for your registration",
    text: `Thank you for registration. Please, confirm your email POST http://localhost:3000/api/users/signup_verify/${code}`,
    html: `<h1>Thank you for registration.</h1><p>Please, confirm your email POST http://localhost:3000/api/users/signup_verify/${code}</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  return res
    .status(201)
    .json(
      `successful authorization for token: ${token}, email: ${user.email}, subscription: ${user.subscription}, avatarURL: ${avatarURL}`
    );
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email, verify: true });
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

const verifyController = async (req, res) => {
  const { code } = req.params;
  const verification = await VerificationSchema.findOne({ code, active: true });
  if (!verification) {
    const error = new Error(`Varification code not found`);
    error.status = 404;
    throw error;
  }
  const user = await UserSchema.findById(verification.userID);
  if (!user) {
    const error = new Error(`User not found`);
    error.status = 404;
    throw error;
  }
  verification.active = false;
  await verification.save();
  user.verify = true;
  await user.save();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: user.email, 
    from: "vlad_np@ukr.net", 
    subject: "Successful confirm email",
    text: `Successful confirming email: ${user.email}`,
    html: `<h1>Thank you for confirming email.</h1><p>You have free access to contact's DB</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  res.status(200).json("Verification successful");
};

const verifyEmailController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    const error = new Error("Missing required field email");
    error.status = 400;
    throw error;
  }
  if (!validator.validate(email)) {
    const error = new Error("Invalid email received");
    error.status = 400;
    throw error;
  }
  const user = await UserSchema.findOne({ email });
  if (!user) {
    const error = new Error(`User not found`);
    error.status = 404;
    throw error;
  }
  if (user.verify) {
    const error = new Error("Verification has already been passed");
    error.status = 400;
    throw error;
  }

  const verification = await VerificationSchema.findOne({
    userID: user._id,
  });
  if (!verification) {
    const error = new Error(`Verification has already been passed`);
    error.status = 404;
    throw error;
  }

  verification.active = true;
  verification.code = uuid();
  await verification.save();

  user.verify = false;
  await user.save();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, 
    from: "vlad_np@ukr.net", 
    subject: "Thank you for your registration",
    text: `Thank you for registration. Please, confirm your email POST http://localhost:3000/api/users/signup_verify/${verification.code}`,
    html: `<h1>Thank you for registration.</h1><p>Please, confirm your email POST http://localhost:3000/api/users/signup_verify/${verification.code}</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  res.status(200).json("Verification email sent");
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  verifyController,
  verifyEmailController,
};
