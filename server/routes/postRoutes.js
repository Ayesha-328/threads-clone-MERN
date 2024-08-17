import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost , getFeedPosts, getUserPosts} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectedRoutes.js";

const router = express.Router();


// get a post feed
router.get("/feed",protectRoute,getFeedPosts);

// get a post
router.get("/:id",getPost);

// get a user's all posts
router.get("/user/:username",getUserPosts);

// Create a post
router.post("/create", protectRoute, createPost);

// Delete a post
router.delete("/:id",protectRoute,deletePost);

// Like/unlike a post
router.put("/like/:id",protectRoute,likeUnlikePost);

// reply a post
router.put("/reply/:id",protectRoute,replyToPost);





export default router;
