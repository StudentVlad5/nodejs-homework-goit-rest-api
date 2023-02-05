const jsonwebtoken = require("jsonwebtoken");
const { UserSchema } = require("../models/user");

const isAuth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [tokenType, token] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    const error = new Error("Not unautorized");
    error.status = 401;
    next(error);
  }
  if (!token) {
    const error = new Error(`Please provide the token`);
    error.status = 401;
    next(error);
  }
  try {
    const { id } = jsonwebtoken.verify(token, process.env.JSONWEBTOKEN_SECRET);
    const user = await UserSchema.findById(id);
    if (!user || !user.token || token !== user.token) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = { isAuth };
