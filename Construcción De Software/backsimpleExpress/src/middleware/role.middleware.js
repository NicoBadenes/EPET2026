// Role Middleware
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check user role here
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = roleMiddleware;
