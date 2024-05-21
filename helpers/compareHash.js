import bcrypt from "bcrypt";

const compareHash = (password, encryptedPassword) =>
  bcrypt.compare(password, encryptedPassword);

export default compareHash;
