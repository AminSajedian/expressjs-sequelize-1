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
import { authenticateUser } from "./auth/auth.js";
import { authorizeUser } from "./auth/auth.js";

const server = express();
const port = process.env.PORT || 5000;
// ******** MIDDLEWARES ************
// Configure cors middleware with allowed origins
server.use(cors({
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}));
// Limit the incoming JSON payload size
server.use(express.json({ limit: '10kb' }));
// Configure cookie-parser middleware with secret key
server.use(cookieParser('mySecretKey'));
// ******** loggerMiddleware ************
// Use async operation with console.table to reduce performance issues

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
// Implement authentication and authorization middleware before the services routes
server.use('/api', authenticateUser, authorizeUser, services);
// Root route handler
server.get('/', (req, res) => {
  res.send('Welcome to the blog posts')
})
// ******** ERROR MIDDLEWARES ************
// Implement custom error handlers before the catch-all error handler
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(unAuthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllErrorHandler);
// ******** DATABASE AND SERVER LISTENING ************
// Use alter: true to apply database schema changes without data loss
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
  })
  .catch((e) => console.error(" ❌ Server is not running due to : ", e));
