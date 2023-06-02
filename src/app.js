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

const app = express();
const port = process.env.PORT || 4000;

// ******** MIDDLEWARES ************
// Configure cors middleware with allowed origins
app.use(cors({
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}));
// Limit the incoming JSON payload size
app.use(express.json({ limit: '3MB' }));
// Configure cookie-parser middleware with secret key
app.use(cookieParser('mySecretKey'));
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

app.use(loggerMiddleware);
// ******** ROUTES ************
// Route Handlers
// Implement authentication and authorization middleware before the services routes

app.use('/api', services);
// app.get('/', (req, res) => {
//   res.send('Welcome to the blog posts')
// })

// ******** ERROR MIDDLEWARES ************
// Implement custom error handlers before the catch-all error handler
app.use(badRequestErrorHandler);
app.use(notFoundErrorHandler);
app.use(unAuthorizedHandler);
app.use(forbiddenHandler);
app.use(catchAllErrorHandler);
// ******** DATABASE AND SERVER LISTENING ************
// Use alter: true to apply database schema changes without data loss
db.sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    console.table(
      listEndpoints(app).map((element) => {
        return {
          path: element.path,
          methods: element.methods,
          // middlewares: element.middlewares,
        };
      })
    );
    app.listen(port, () => console.log(`server is running on port ${port}`));
  })
  .catch((e) => console.error(" ❌ Server is not running due to : ", e));
