import jwt from "jsonwebtoken";
import { jwtExpiration } from "../constants/constants.js";
import "dotenv/config";

const { JWT_SECRET } = process.env;

export const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: jwtExpiration });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
