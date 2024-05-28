import bcrypt from "bcrypt";
import gravatar from "gravatar";
import User from "../models/User.js";
import encryptPassword from "../helpers/encryptPassword.js";

const findUser = (filter) => User.findOne(filter);

const saveUser = async (data) => {
  const avatarURL = gravatar.url(
    data.email,
    { s: "250", r: "pg", d: "mm" },
    true
  );
  const encryptedPassword = await encryptPassword(data.password);
  return User.create({ ...data, password: encryptedPassword, avatarURL });
};

const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

const authServices = {
  findUser,
  saveUser,
  updateUser,
};

export default authServices;
