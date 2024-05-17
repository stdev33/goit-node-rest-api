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

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await compareHash(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await authServices.updateUser({ _id }, { token: "" });

  res.status(204).send();
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    username,
    email,
  });
};

export default {
  register: controllerFuncWrapper(register),
  login: controllerFuncWrapper(login),
  logout: controllerFuncWrapper(logout),
  getCurrent: controllerFuncWrapper(getCurrent),
};
