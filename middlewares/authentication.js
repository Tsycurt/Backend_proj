const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
  try {
    const payload = isTokenValid(token);
    req.user = payload.user
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError.UnauthorizedError("Unauthorized to access this route")
      );
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
