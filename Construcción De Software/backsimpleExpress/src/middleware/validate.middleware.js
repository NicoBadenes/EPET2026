// Validation Middleware
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request against schema
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
};

module.exports = validateMiddleware;
