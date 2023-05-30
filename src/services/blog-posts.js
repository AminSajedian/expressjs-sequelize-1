import express from "express";
import createError from "http-errors";
// import bcrypt from "bcrypt";
// import { JWTAuthMid } from "../../auth/middlewares.js";
// import { JWTAuthenticate } from "../../auth/tools.js";
import db from "../db/index.js";
const { BlogPost } = db;

const blogPostsRouter = express.Router();

/*******************************************/
/************ BlogPosts Routers ************/
/*******************************************/

/*** Create My BlogPost ***/
blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const blogPost = await BlogPost.create(req.body);
    res.status(201).send(blogPost);

  } catch (error) {
    console.error(error);
    next(createError(500, "An error occurred creating a new BlogPost"));
  }
}
);

/*** Get All BlogPosts  ***/
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findAll();
    res.send(blogPost);
  } catch (error) {
    console.table([{ Error: error.status, Message: error.message }]);
    console.error(error);
    next(createError(500, "An error occurred while getting blog Posts"));
  }
});

/*** Get BlogPost by Id  ***/
blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.blogPostId);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `blogPost with ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    console.table([{ Error: error.status, Message: error.message }]);
    console.error(error);
    next(createError(500, "An error occurred while a user logging in"));
  }
});

// /*** Update My BlogPost  ***/
// blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
//   try {
//     if (
//       req.body.id ||
//       req.body.blogPostTypeId ||
//       req.body.email ||
//       req.body.password
//     ) {
//       next(
//         createError(
//           403,
//           "You are not allowed to change blogPostTypeId, blogPostId, email and password in this way"
//         )
//       );
//     } else {
//       const data = await BlogPost.update(req.body, {
//         where: { id: req.blogPost.id },
//       });

//       if (data[0]) {
//         res.send(`updated`);
//       } else {
//         next(createError(404, `blogPost not found`));
//       }
//     }
//   } catch (error) {
//     console.table([{ Error: error.status, Message: error.message }]);
//     console.error(error);
//     next(createError(500, "An error occurred while modifying blogPost"));
//   }
// });

// /*** Delete My BlogPost  ***/
// // we can use Paranoid (soft-deletion of records), instead of a hard-deletion
// blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
//   try {
//     const row = await BlogPost.destroy({
//       where: { id: req.blogPost.id },
//     });
//     if (row > 0) {
//       res.send("deleted");
//     } else {
//       next(createError(404));
//     }
//   } catch (error) {
//     console.table([{ Error: error.status, Message: error.message }]);
//     console.error(error);
//     next(createError(500, "An error occurred while deleting blogPost"));
//   }
// });

export default blogPostsRouter;
