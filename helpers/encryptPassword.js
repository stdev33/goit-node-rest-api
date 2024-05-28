import bcrypt from "bcrypt";
import { bcryptSaltRounds } from "../constants/constants.js";

const encryptPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, bcryptSaltRounds);
  return encryptedPassword;
};

export default encryptPassword;
