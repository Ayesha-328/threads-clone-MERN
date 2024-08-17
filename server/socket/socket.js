import { Server } from "socket.io";
import http from 'http';
import express from 'express';
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId] ? [...userSocketMap[recipientId]] : [];
};

const userSocketMap = {}; // userId: Set of socketIds

io.on('connection', (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = new Set();
        }
        userSocketMap[userId].add(socket.id);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast online users

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
		try {
			await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            

            // Get all socket IDs associated with the user
             const recipientSockets = [...userSocketMap[userId]];
			// io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
            recipientSockets.forEach(socketId => {
                io.to(socketId).emit("messagesSeen", { conversationId });
            });
		} catch (error) {
			console.log(error);
		}
	});

    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
        if (userId) {
            userSocketMap[userId].delete(socket.id);
            if (userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online users
        }
    });
});

export { io, server, app };
