import express from "express";
import createError from "http-errors";
// import bcrypt from "bcrypt";
// import { JWTAuthMid } from "../../auth/middlewares.js";
// import { JWTAuthenticate } from "../../auth/tools.js";
import db from "../../db/index.js";
const { BlogPost } = db;

const blogPostsRouter = express.Router();

/*******************************************/
/************ BlogPosts Routers ************/
/*******************************************/

/*** Get All BlogPost  ***/
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findAll();
    res.send(blogPost);
  } catch (error) {
    console.error("\x1b[41m%s\x1b[0m", error);
    console.table([{ Error: error.status, Message: error.message }]);
    next(createError(500, "An error occurred while getting blog Posts"));
  }
});

/*** Get one BlogPost by Id  ***/
blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.blogPostId);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `blogPost with ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    console.error("\x1b[41m%s\x1b[0m", error);
    console.table([{ Error: error.status, Message: error.message }]);
    next(createError(500, "An error occurred while getting blog Post"));
  }
});

// /*** Get My BlogPost Account ***/
// blogPostsRouter.get("/posts", async (req, res, next) => {
//   try {
//     const blogPost = await BlogPostAccount.findByPk(req.blogPost.id, {
//       // attributes: {
//       //   exclude: ["id", "password", "createdAt", "updatedAt"],
//       // },
//       include: {
//         model: BlogPostType,
//         attributes: ["blogPostTypeName"],
//       },
//     });
//     // blogPostTypeId deleted for the security reasone
//     delete blogPost.dataValues.blogPostTypeId;
//     if (blogPost) {
//       res.send(blogPost);
//     } else {
//       next(createError(404, `blogPost ${req.blogPost.id} not found`));
//     }
//   } catch (error) {
//     console.error("\x1b[41m%s\x1b[0m", error);
//     console.table([{ Error: error.status, Message: error.message }]);
//     next(createError(500, "An error occurred while getting blogPost"));
//   }
// });

// /*** Update My BlogPost Account ***/
// blogPostsRouter.put("/posts", JWTAuthMid, async (req, res, next) => {
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
//       const data = await BlogPostAccount.update(req.body, {
//         where: { id: req.blogPost.id },
//       });

//       if (data[0]) {
//         res.send(`updated`);
//       } else {
//         next(createError(404, `blogPost not found`));
//       }
//     }
//   } catch (error) {
//     console.error("\x1b[41m%s\x1b[0m", error);
//     console.table([{ Error: error.status, Message: error.message }]);

//     next(createError(500, "An error occurred while modifying blogPost"));
//   }
// });

// /*** Delete My BlogPost Account ***/
// // we can use Paranoid (soft-deletion of records), instead of a hard-deletion
// blogPostsRouter.delete("/posts", JWTAuthMid, async (req, res, next) => {
//   try {
//     const row = await BlogPostAccount.destroy({
//       where: { id: req.blogPost.id },
//     });
//     if (row > 0) {
//       res.send("deleted");
//     } else {
//       next(createError(404));
//     }
//   } catch (error) {
//     console.error("\x1b[41m%s\x1b[0m", error);
//     console.table([{ Error: error.status, Message: error.message }]);
//     next(createError(500, "An error occurred while deleting blogPost"));
//   }
// });

export default blogPostsRouter;
