const isAdminUser = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access is denied, user does not have admin right",
    });
  }
  next();
};
module.exports = isAdminUser;
