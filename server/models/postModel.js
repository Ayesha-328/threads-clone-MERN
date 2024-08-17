import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type:String,
        maxLength:500,
    },
    likes:{
        // Array of user ids
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[],
    },
    img:{
        type: String,
    },
    replies:[{
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required: true
            },
            text:{
                type:String,
                required: true,
            },
            userProfilePic:{
                type: String,
            },
            username:{
                type: String,
            },
            createdAt: {
              type: Date,
              default: Date.now // Automatically set the current date and time when a reply is created
            }
        }
    ]
    },
{
    timestamps: true,
})

const Post=mongoose.model('Post', postSchema);

export default Post;