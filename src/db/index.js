import seq from "sequelize";
const { Sequelize, DataTypes } = seq;

/*** Import Models ***/
import BlogPost from "./blog-post.model.js";
import User from "./user.model.js";

/****** Import Models Associations  ******/
// import Associations from "./associations.js";

/****** Import Environment Variables  ******/
const { DB_DIALECT, DB_USER, DB_PORT, DB_NAME, DB_PASSWORD, DB_HOST, DB_SSL_CA } = process.env;

/*** Connecting to a database ***/
/*** Passing parameters separately (other dialects) for connection to the database ***/
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: DB_DIALECT,
});

/****** Define Models (Tables) ******/
const db = {
  User: User(sequelize, DataTypes),
  BlogPost: BlogPost(sequelize, DataTypes),
  sequelize: sequelize,
};

/****** Define Models Associations  ******/
// Associations(db);

/*** Testing the connection ***/
/*** Using the .authenticate() function to test if the connection is OK ***/
sequelize
  .authenticate()
  .then(() =>
    console.log("Connection to database has been established successfully.")
  )
  .catch((error) => console.log("Unable to connect to the database:", error));


export default db;
