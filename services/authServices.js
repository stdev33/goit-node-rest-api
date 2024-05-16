import bcrypt from "bcrypt";
import User from "../models/User.js";

const findUser = (filter) => User.findOne(filter);

const saveUser = async (data) => {
  const encryptedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: encryptedPassword });
};

const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

const authServices = {
  findUser,
  saveUser,
  updateUser,
};

export default authServices;
