import createError from "http-errors";
import { verifyToken } from "./tools.js";

import db from "../db/index.js";
const { User } = db;

export const JWTAuthMid = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    next(createError(401, "Please Log in!"));
  } else {
    try {
      try {
        const content = await verifyToken(req.cookies.accessToken);
        req.content = content
      } catch (error) {
        throw createError(401, "Token is not valid!")
      }
      const user = await User.findByPk(req.content.id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(createError(404, "User not found!"));
      }
    } catch (error) {
      next(createError(401, "Token not valid!"));
    }
  }
};
