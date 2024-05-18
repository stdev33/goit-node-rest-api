import bcrypt from "bcrypt";
import User from "../models/User.js";
import { bcryptSaltRounds } from "../constants/constants.js";

const findUser = (filter) => User.findOne(filter);

const saveUser = async (data) => {
  const encryptedPassword = await bcrypt.hash(data.password, bcryptSaltRounds);
  return User.create({ ...data, password: encryptedPassword });
};

const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

const authServices = {
  findUser,
  saveUser,
  updateUser,
};

export default authServices;
