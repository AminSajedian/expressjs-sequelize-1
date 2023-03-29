import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import db from "./db/index.js";
import cookieParser from "cookie-parser";
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
  unAuthorizedHandler,
  forbiddenHandler,
} from "./errorHandlers.js";
import services from "./services/index.js";

const server = express();
const port = process.env.PORT || 5000;
// const port = 5000;

// ******** MIDDLEWARES ************
server.use(cors());
server.use(express.json());
server.use(cookieParser());

// ******** loggerMiddleware ************
const loggerMiddleware = (req, res, next) => {
  console.table([
    {
      "request method": req.method,
      "request url": req.url,
      "request date": new Date(),
    },
  ]);

  next();
};
server.use(loggerMiddleware);

// ******** ROUTES ************
server.get('/', (req, res) => { res.send('Welcome to the blog posts') })
server.use("/api", services);


// ******** ERROR MIDDLEWARES ************
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(unAuthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllErrorHandler);

// ******** DATABASE AND SERVER LISTENING ************
db.sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    console.table(
      listEndpoints(server).map((element) => {
        return {
          path: element.path,
          methods: element.methods,
          // middlewares: element.middlewares,
        };
      })
    );
    server.listen(port, () => console.log(`server is running on port ${port}`));
    server.on("error", (error) =>
      console.info(" ❌ Server is not running due to : ", error)
    );
  })
  .catch((e) => console.log(e));
