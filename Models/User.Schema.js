const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    Username:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Image:{
        type:String,
        require:true
    },
    Is_Online:{
        type:String,
        default:"0"
    }  
},{timestamp:true})

const User=mongoose.model("User",UserSchema)

module.exports=User
