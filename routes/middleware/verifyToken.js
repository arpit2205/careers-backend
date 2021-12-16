const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res
      .status(403)
      .json({ status: "error", message: "No token provided" });

  try {
    // Authorization header format: Bearer <token>
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.body.user = decoded;
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }

  return next();
};

module.exports = verifyToken;
