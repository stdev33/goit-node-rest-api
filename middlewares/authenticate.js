import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import authServices from "../services/authServices.js";

const unauthorizedError = HttpError(401, "Not authorized");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(unauthorizedError);
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(unauthorizedError);
  }

  try {
    const { id } = verifyToken(token);
    const user = await authServices.findUser({ _id: id });
    if (!user) {
      return next(unauthorizedError);
    }
    if (!user.token) {
      return next(unauthorizedError);
    }

    req.user = user;
    next();
  } catch (error) {
    next(unauthorizedError);
  }
};

export default authenticate;
