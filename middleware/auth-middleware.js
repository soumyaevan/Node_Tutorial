const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access is denied, please login to continue",
    });
  }
  try {
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedInfo;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Access is denied, login session is expired",
      error,
    });
  }
};
module.exports = authMiddleware;
