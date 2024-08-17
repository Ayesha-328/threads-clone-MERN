import express from "express";
import { signupUser,loginUser,logoutUser,followUnFollowUser,updateUser,getUserProfile , getSuggestedUsers, freezeAccount} from "../controllers/userControlller.js";
import protectRoute from "../middlewares/protectedRoutes.js";
import {v2 as cloudinary} from "cloudinary";

const router = express.Router();

// get user profile
router.get("/profile/:query", getUserProfile)

// get suggested users
router.get("/suggested",protectRoute, getSuggestedUsers)

// signUp
router.post("/signup", signupUser)

// login
router.post("/login", loginUser)

// logout
router.post("/logout", logoutUser)

//follow 
router.post("/follow/:id",protectRoute, followUnFollowUser)

// updatae profile
router.put("/update/:id",protectRoute, updateUser)

// Freeze account
router.put("/freeze",protectRoute, freezeAccount)



export default router;
