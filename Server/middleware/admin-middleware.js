const isAdminUser = (req, res, next) => {
  const role = (req.user && req.user.role) || (req.userInfo && req.userInfo.role);
  if (role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin only resource.',
      success: false,
    });
  }
  next();
};

module.exports = isAdminUser;
