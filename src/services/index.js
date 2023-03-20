import express from "express";
const route = express.Router();

// import usersRoute from "./users/index.js";
import blogPostsRoute from "./blog-posts/index.js";

// route.use("/users", usersRoute);
route.use("/blog-posts", blogPostsRoute);

export default route;