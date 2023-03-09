import express from "express";
const route = express.Router();

import usersRoute from "./users/index.js";

route.use("/users", usersRoute);

export default route;