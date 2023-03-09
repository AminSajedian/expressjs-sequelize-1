import seq from "sequelize";
const { Sequelize, DataTypes } = seq;

/****** Import Models  ******/
/*** User Management ***/
import UserAccount from "./user-management/user-account.model.js";
import UserType from "./user-management/user-type.model.js";
import UserLog from "./user-management/user-log.model.js";

/****** Import Models Associations  ******/
import Associations from "./associations.js";

/****** Import Environment Variables  ******/
const { DB_USER, DB_PORT, DB_NAME, DB_PASSWORD, DB_HOST } = process.env;

/*** Connecting to a database ***/
/*** Passing parameters separately (other dialects) for connection to the database ***/
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: "mariadb",
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },
});

/*** Testing the connection ***/
/*** Using the .authenticate() function to test if the connection is OK ***/
sequelize
  .authenticate()
  .then(() =>
    console.log("Connection to database has been established successfully.")
  )
  .catch((error) => console.log("Unable to connect to the database:", error));

/****** Define Models (Tables) ******/
const db = {
  /*** User Management ***/
  UserAccount: UserAccount(sequelize, DataTypes),
  UserType: UserType(sequelize, DataTypes),
  UserLog: UserLog(sequelize, DataTypes),

  sequelize: sequelize,
};

/****** Define Models Associations  ******/
Associations(db);

export default db;
