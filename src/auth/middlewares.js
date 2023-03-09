import createError from "http-errors";
import { verifyToken } from "./tools.js";

import db from "../db/index.js";
const { UserAccount, UserType } = db;

export const JWTAuthMid = async (req, res, next) => {
  // 1. Check if Authorization header is received, if it is not --> trigger an error (401)
  // if (!req.headers.authorization) {
  //   next(createError(401, "Please provide token in the authorization header!"));
  // } else {
  if (!req.cookies.accessToken) {
    // IF YOU DON'T USE COOKIE-PARSER REQ.COOKIES WILL BE UNDEFINED!!
    next(createError(401, "Please Log in!"));
  } else {
    try {
      // 2. Extract the token from authorization header (Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGVkNWI4N2M0MjM1YTFkZWNhOGY3YzIiLCJpYXQiOjE2MjYyNTI3NTcsImV4cCI6MTYyNjg1NzU1N30.VA7M1z2LRAilFGLt1grvEIdv1VI2WUwpGWo_N0yzodg)
      // const token = req.headers.authorization.replace("Bearer ", "");

      // 3. Verify the token (decode it)
      // const content = await verifyToken(token);
      const content = await verifyToken(req.cookies.accessToken);

      // 4. Find user in db and attach him/her to the request object
      const user = await UserAccount.findByPk(content.id, {
        include: {
          model: UserType,
          attributes: ["userTypeName"],
        },
      });

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

export const adminAuthMid = (req, res, next) => {
  if (req.user.user_type.userTypeName === "administrator") {
    next();
  } else {
    next(createError(403, "Admins only!"));
  }
};

export const jobseekerAuthMid = async (req, res, next) => {
  const userTypeName = req.user.user_type.userTypeName;
  if (userTypeName === "jobseeker" || userTypeName === "administrator") {
    next();
  } else {
    next(createError(403, "Forbidden"));
  }
};

export const recruiterAuthMid = async (req, res, next) => {
  const userTypeName = req.user.user_type.userTypeName;
  if (userTypeName === "recruiter" || userTypeName === "administrator") {
    next();
  } else {
    next(createError(403, "Forbidden"));
  }
};
