module.exports = function (req,res,next) {
  // 401 Unauthorized - invalid token
  // 403 Forbidden - invalid role access or multiple attempts to enter invalid token
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  next();
}