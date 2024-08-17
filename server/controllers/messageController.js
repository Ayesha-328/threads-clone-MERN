import Conversation from '../models/conversationModel.js'
import Message from '../models/messageModel.js'
import { getRecipientSocketId } from '../socket/socket.js';
import { io } from '../socket/socket.js';
import { v2 as cloudinary } from "cloudinary";

const sendMessage = async(req, res) =>{
try {
    const {recipientId, message} = req.body;
    let {img} = req.body


    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
        participants: {$all : [senderId, recipientId]},
    })

    if(!conversation){
        conversation= new Conversation({
            participants: [senderId, recipientId],
            lastMessage: {
                text: message,
                sender:senderId,
            }
        })
        await conversation.save()
    }

    if(img){
        const uploadedResponse = await cloudinary.uploader.upload(img)
        img = uploadedResponse.secure_url
    }
    const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        text: message,
        img:img || ""
    })

    await Promise.all([
        newMessage.save(),
        conversation.updateOne({
            lastMessage:{
                text: message,
                sender: senderId,
            }
        })
    ])

    const recipientSocketId = getRecipientSocketId(recipientId)
    if(recipientSocketId){
        io.to(recipientSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage)
} catch (error) {
    res.status(500).json({error: error.message})
    
}
}

const getMessages = async(req,res)=>{
    const {otherUserId} = req.params;
    const userId = req.user._id
    try {
        const conversation = await Conversation.findOne({
            participants: {$all : [userId, otherUserId]},
        })
        if(!conversation){
            return  res.status(404).json({error: "Conversation not found"})  
        }

        const messages= await Message.find({
           conversationId:conversation._id
        }).sort({createdAt: 1})


        res.status(200).json(messages)
        
    } catch (error) {
        res.status(500).json({error: error.message})  
    }

}
async function getConversations(req, res) {
	const userId = req.user._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});
		res.status(200).json(conversations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

const deleteMessage = async(req, res)=>{
    try {
        const messageId=	req.params;	
        const message = await Message.findById(req.params.messageId);
		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		if (message.sender.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete message" });
		}

		if (message.img) {
			const imgId = message.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

        // / Find the conversation associated with the message
        const conversation = await Conversation.findById(message.conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Check if the message to be deleted is the last message in the conversation
        const isLastMessage = conversation.lastMessage &&
            conversation.lastMessage.text === message.text &&
            conversation.lastMessage.sender.toString() === message.sender.toString() &&
            conversation.lastMessage.seen === message.seen;

		await Message.findByIdAndDelete(req.params.messageId);

        if (isLastMessage) {
            // If the deleted message was the last message, update the lastMessage field
            const lastMessage = await Message.findOne({ conversationId: conversation._id })
                .sort({ createdAt: -1 }); // Find the most recent message

            conversation.lastMessage = lastMessage ? {
                text: lastMessage.text,
                sender: lastMessage.sender,
                seen: lastMessage.seen
            } : null; // Set to null if no messages are left
        }

        await conversation.save();

		res.status(200).json({ message: "Message deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

export {sendMessage, getMessages, getConversations, deleteMessage};