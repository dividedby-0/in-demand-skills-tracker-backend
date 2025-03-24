const jwt = require("jsonwebtoken");
const CustomError = require("../errors");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new CustomError("No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};