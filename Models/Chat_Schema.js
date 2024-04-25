const mongoose=require('mongoose')

const chatSchema=new mongoose.Schema({
    Sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Message:{
        type:String,
        require:true
    }
},{timestamps:true})

const Chat=mongoose.model("ChatMessage",chatSchema)

module.exports=Chat