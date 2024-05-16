import authServices from "../services/authServices.js";
import controllerFuncWrapper from "../decorators/controllerFuncWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const createdUser = await authServices.saveUser(req.body);

  res.status(201).json({
    email: createdUser.email,
    subscription: createdUser.subscription,
  });
};

export default {
  register: controllerFuncWrapper(register),
};
