module.exports = function (req,res,next) {
  // Meaning of codes:
  // 401 Unauthorized - invalid token
  // 403 Forbidden - invalid role access (other cases - multiple attempts to enter invalid token)
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  next();
}