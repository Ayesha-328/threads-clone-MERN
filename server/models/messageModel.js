import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
    },
    seen:{
        type:Boolean,
        default: false
    },
    img:{
        type: String,
        default: ""
    }
},  
{
    timestamps: true,
})

const Message=mongoose.model('Message', messageSchema);

export default Message;