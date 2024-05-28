import authServices from "../services/authServices.js";
import controllerFuncWrapper from "../decorators/controllerFuncWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import jimp from "jimp";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const createdUser = await authServices.saveUser(req.body);

  res.status(201).json({
    user: {
      email: createdUser.email,
      subscription: createdUser.subscription,
    },
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
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await authServices.updateUser({ _id }, { subscription });

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  try {
    const { path: tempPath, originalname } = req.file;
    const newFileName = uuidv4() + path.extname(originalname);
    const newPath = path.join(avatarsPath, newFileName);

    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(newPath);
    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${newFileName}`;
    const updatedUser = await authServices.updateUser(
      { _id: req.user._id },
      { avatarURL }
    );

    if (!updatedUser) {
      throw HttpError(404, "User not found");
    }

    res.status(200).json({ avatarURL });
  } catch (error) {
    if (req.file) {
      await fs
        .unlink(req.file.path)
        .catch((e) => console.error("Cannot remove temp file", e));
    }

    res.status(500).json({ message: "Cannot process image" });
  }
};

export default {
  register: controllerFuncWrapper(register),
  login: controllerFuncWrapper(login),
  logout: controllerFuncWrapper(logout),
  getCurrent: controllerFuncWrapper(getCurrent),
  updateSubscription: controllerFuncWrapper(updateSubscription),
  updateAvatar: controllerFuncWrapper(updateAvatar),
};
