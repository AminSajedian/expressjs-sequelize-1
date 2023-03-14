import express from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import { JWTAuthMid } from "../../auth/middlewares.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import db from "../../db/index.js";
const { UserAccount, UserType, UserLog } = db;

const usersRouter = express.Router();

/****************************************/
/************ Models Methods ************/
/****************************************/
UserAccount.checkUserTypeName = async function (req) {
  if (req.body.userTypeName === "standard-user") {
  } else {
    const error = new Error(`user type is not correct`);
    error.status = 403;
    throw error;
  }
};

UserAccount.setUserTypeId = async function (req) {
  try {
    // find the userType record (row) regarding the userTypeName on the database
    const userType = await UserType.findOne({
      where: { userTypeName: req.body.userTypeName },
    });

    if (userType) {
      // adding the associated id of userTypeName to the req.body
      req.body.userTypeId = userType.id;
    } else {
      const error = new Error(
        `userType is not found. Contact support to resolve this issue`
      );
      error.status = 404;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

UserAccount.checkCredentials = async function (email, plainPw) {
  try {
    // Find user in db by email
    const user = await UserAccount.findOne({ where: { email } });
    if (user) {
      // 2. compare plainPw with hashed pw
      const hashedPw = user.password;
      const isMatch = await bcrypt.compare(plainPw, hashedPw);

      // 3. return a meaningful response
      if (isMatch) return user;
      else return null;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

UserAccount.hashPassword = async function (req) {
  try {
    const plainPw = req.body.password;
    req.body.password = await bcrypt.hash(plainPw, 10);
  } catch (error) {
    throw error;
  }
};

UserAccount.createAccount = async function (req) {
  try {
    await UserAccount.create(req.body);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      error.status = 403;
      error.message = "User already exists";
      // console.error("Error Message: ", `${error.errors[0].message}`);
    }
    throw error;
  }
};

/***************************************/
/************ Users Routers ************/
/***************************************/

/*** Create a User Account ***/
usersRouter.post("/signup", async (req, res, next) => {
  try {
    await UserAccount.checkUserTypeName(req);

    // set UserTypeId according to the userTypeName
    await UserAccount.setUserTypeId(req);

    // hash the user's password
    await UserAccount.hashPassword(req);

    // creating the user account
    await UserAccount.createAccount(req);

    res.status(201).send("created");
  } catch (error) {
    console.table([{ Error: error.status, Message: error.message }]);
    console.error(error);
    next(createError(500, "An error occurred while creating a new user"));
  }
});

/*** Log in the User ***/
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verify credentials
    const user = await UserAccount.checkCredentials(email, password);

    // Generate token if credentials are ok
    if (user) {
      await UserLog.create({ userAccountId: user.id });

      const accessToken = await JWTAuthenticate(user);

      // 3. Send tokens as a response
      res.cookie("accessToken", `${accessToken}`, {
        httpOnly: true,
      }); // in production environment you should have sameSite: "none", secure: true
      // res.cookie("refreshToken", req.user.tokens.refreshToken, {
      //   httpOnly: true,
      // });
      res.send({ accessToken });
    } else {
      next(createError(401, `email or password is wrong please check at once`));
    }
  } catch (error) {
    console.error("\x1b[41m%s\x1b[0m", error);
    console.table([{ Error: error.status, Message: error.message }]);
    next(createError(500, "An error occurred while a user logging in"));
  }
});

/*** Get My User Account ***/
usersRouter.get("/my-account", JWTAuthMid, async (req, res, next) => {
  try {
    const user = await UserAccount.findByPk(req.user.id, {
      attributes: {
        exclude: ["id", "password", "createdAt", "updatedAt"],
      },
      include: {
        model: UserType,
        attributes: ["userTypeName"],
      },
    });
    // userTypeId deleted for the security reasone
    delete user.dataValues.userTypeId;
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `user ${req.user.id} not found`));
    }
  } catch (error) {
    console.error("\x1b[41m%s\x1b[0m", error);
    console.table([{ Error: error.status, Message: error.message }]);
    next(createError(500, "An error occurred while getting user"));
  }
});

/*** Update My User Account ***/
usersRouter.put("/my-account", JWTAuthMid, async (req, res, next) => {
  try {
    if (
      req.body.id ||
      req.body.userTypeId ||
      req.body.email ||
      req.body.password
    ) {
      next(
        createError(
          403,
          "You are not allowed to change userTypeId, userId, email and password in this way"
        )
      );
    } else {
      const data = await UserAccount.update(req.body, {
        where: { id: req.user.id },
      });

      if (data[0]) {
        res.send(`updated`);
      } else {
        next(createError(404, `user not found`));
      }
    }
  } catch (error) {
    console.error("\x1b[41m%s\x1b[0m", error);
    console.table([{ Error: error.status, Message: error.message }]);

    next(createError(500, "An error occurred while modifying user"));
  }
});

/*** Delete My User Account ***/
// we can use Paranoid (soft-deletion of records), instead of a hard-deletion
usersRouter.delete("/my-account", JWTAuthMid, async (req, res, next) => {
  try {
    const row = await UserAccount.destroy({
      where: { id: req.user.id },
    });
    if (row > 0) {
      res.send("deleted");
    } else {
      next(createError(404));
    }
  } catch (error) {
    console.error("\x1b[41m%s\x1b[0m", error);
    console.table([{ Error: error.status, Message: error.message }]);
    next(createError(500, "An error occurred while deleting user"));
  }
});

export default usersRouter;
