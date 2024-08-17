import express from "express";
import protectRoute from "../middlewares/protectedRoutes.js";
import { sendMessage , getMessages , getConversations, deleteMessage} from "../controllers/messageController.js";


const router = express.Router();

router.get("/conversations",protectRoute,getConversations)

router.post("/",protectRoute,sendMessage)

router.get("/:otherUserId",protectRoute,getMessages)

router.delete("/:messageId",protectRoute,deleteMessage)



export default router;
