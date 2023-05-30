import express from "express";
const route = express.Router();

// import usersRoute from "./users/index.js";
import usersRouter from "./users.js";
import blogPostsRoute from "./blog-posts.js";

// route.use("/users", usersRoute);
route.use("/users", usersRouter);
route.use("/blog-posts", blogPostsRoute);

export default route;