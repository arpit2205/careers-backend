const verifyAdmin = (req, res, next) => {
  const user = req.body.user;

  if (!user.isAdmin) {
    return res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  }

  return next();
};

module.exports = verifyAdmin;
