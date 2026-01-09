/**
 * Authentication Middleware
 * Checks if user is authenticated before allowing access to protected routes
 */

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    message: "Unauthorized. Please log in to access this resource.",
    redirect: "/login",
  });
};

/**
 * Optional authentication middleware
 * Allows access but attaches user if authenticated
 */
const optionalAuth = (req, res, next) => {
  // User info will be available if authenticated, otherwise proceed without
  next();
};

/**
 * Admin authorization middleware
 * Checks if user has admin role (for future implementation)
 */
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }

  res.status(403).json({
    message: "Forbidden. Admin access required.",
  });
};

module.exports = {
  isAuthenticated,
  optionalAuth,
  isAdmin,
};
