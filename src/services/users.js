import express from "express";
// import multer from "multer";
import createError from "http-errors";
import bcrypt from "bcrypt";
// import { JWTAuthenticate, verifyToken } from "../../auth/tools.js";
import db from "../db/index.js";
const { User } = db;

const usersRouter = express.Router();

/***************************************/
/************ Users Routers ************/
/***************************************/

/****** Sign up ******/
usersRouter.post(
  "/signup",
  // *** find and add "basic" UserTypeId to the req.body ***
  async (req, res, next) => {
    try {
      // *** create a user account ***
      const result = await User.create(req.body);
      console.log("result: ", result);
      if (!result) {
        throw createError(400, "An error occurred in creating a User");
      }
      
      // *** get the user account and exclude some attributes ***
      const user = await User.findByPk(result.id, {
        // where: { email: req.newUser.email },
        attributes: {
          exclude: ["id", "password", "createdAt", "updatedAt"],
        },
      });

      res.status(200).send(user);

    } catch (error) {
      next(error);
    }
  }
);

/****** Log in ******/
usersRouter.post("/login", async (req, res, next) => {
  try {
    // *** check if email and password are provided ***
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError(401, "Please provide email and password!");
    }
    // *** find user on db by email ***
    const result = await User.findOne({
      where: { email },
      attributes: {
        exclude: ["userTypeId", "createdAt", "updatedAt"],
      },
    });
    if (!result) {
      // email is wrong
      throw createError(404, "email or password is wrong please check at once");
    }

    const user = result.toJSON();
    // *** compare password with hashed pw on db ***
    const hashedPw = user.password;
    const isMatch = await bcrypt.compare(password, hashedPw);
    delete user.password;

    if (!isMatch) {
      // email is wrong
      throw createError(401, "email or password is wrong please check at once");
    }
    // *** user logins creation on the db ***

    // *** send accessToken and user's details as response ***
    // *** Generate token ***
    const accessToken = await JWTAuthenticate(user);

    // TODO sync created token with res.cookie properties
    const { exp } = await verifyToken(accessToken);

    // 3. Send tokens as a response
    res.cookie("accessToken", accessToken, {
      // maxAge: 25 * 60 * 60 * 1000 , // 90000000 milliseconds = 1 Day
      expires: new Date(exp * 1000),
      path: "/",
      httpOnly: true,
      // secure: true,
      // domain: "localhost",
      // sameSite: "none",
    });
    // in production environment you should have sameSite: "none", secure: true
    // res.cookie("refreshToken", user.tokens.refreshToken, {
    //   httpOnly: true,
    // });

    user.accessToken = accessToken;
    delete user.id;

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
