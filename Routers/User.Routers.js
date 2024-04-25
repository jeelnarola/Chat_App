const {Router}=require('express')
const path=require('path')
const bcrypt=require('bcrypt')
const multer=require('multer')
const session=require('express-session')
const User = require('../Models/User.Schema')
const { Islogout, Islogin } = require('../Middleware/auth.middleware')
const Chat = require('../Models/Chat_Schema')
require("dotenv").config()
const User_router=Router()
User_router.use(session({secret:process.env.SECRET}))


const stor=multer.diskStorage({
    destination:"Image",
    filename:(req,file,cd)=>{
        cd(null,Date.now+file.originalname)
    }
})

const uplod=multer({
    storage:stor
})

User_router.get("/",(req,res)=>{
    res.render("index")
})

User_router.get("/signup",Islogout,(req,res)=>{
    res.render("signup")
})

User_router.post("/signup",uplod.single("Image"),async(req,res)=>{
   try{
    let {Username,Email,Password}=req.body

    let data=await User.findOne({Email:Email})

    if(data){
        res.status(200).redirect("login")
    }else{
        bcrypt.hash(Password,5,async(err,hash)=>{
            if(err){
                console.log(err);
            }
            else{
                let obj={
                    Image:path.dirname(__dirname+"/Image"+req.file.originalname),
                    Username,
                    Email,
                    Password:hash
                }
                let data=await User.create(obj)
                req.session.user=data
                res.status(200).redirect("dashbord")
            }
        })
    }
   }catch(err){
    console.log(err);
   }
})

User_router.get("/login",Islogout,(req,res)=>{
    res.render("login")
})

User_router.post("/login",async(req,res)=>{

   try{
    let {Email,Password}=req.body
    let data=await User.findOne({Email:Email})

    if(data){
        bcrypt.compare(Password,data.Password,async(err,done)=>{
            if(err){
                console.log(err);
            }
            if(done){
                req.session.user=data
                res.redirect("dashbord")
            }
        })

    }else{
        res.redirect("signup")
    }
   }catch(err){
    console.log(err)
   }
})

User_router.get("/dashbord",Islogin,async(req,res)=>{
    try{
        let user=req.session.user._id
        let data=await User.find({_id:{$nin:[req.session.user._id]}})
        res.render("dashbord",{user:req.session.user,Users:data})
 }catch(error){
    console.log(error);
 }
})

User_router.get("/logout",Islogin,async(req,res)=>{
    req.session.destroy()
    res.redirect("signup")
})

User_router.post("/saveChat",async(req,res)=>{
    console.log(req.body);
    let chat={
        Sender_id:req.body.sender_id,
        Receiver_id:req.body.receiver_id,
        Message:req.body.msg
    }
    let data=await Chat.create(chat)
    res.send(data)
})
module.exports=User_router