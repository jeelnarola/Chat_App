const bodyParser = require('body-parser')
const express=require('express')
const ejs=require('ejs')
const http=require('http')
const User_router = require('./Routers/User.Routers')
const database = require('./Config/database')
const User = require('./Models/User.Schema')
const Chat = require('./Models/Chat_Schema')
require("dotenv").config()
const app=express()
const server=http.createServer(app)
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs')
app.set('Views',__dirname+'/Views')
app.use(express.static(__dirname+'/Public'))


        // Socket.IO

    const io=require('socket.io')(server)
    var usp = io.of('/user')
    usp.on('connection',async function(socket){
        await User.findByIdAndUpdate({_id:socket.handshake.auth.token},{Is_Online:'1'})

        socket.broadcast.emit("getonlienUser",{User_id:socket.handshake.auth.token})

        socket.on('disconnect',async function(){
        await User.findByIdAndUpdate({_id:socket.handshake.auth.token},{Is_Online:'0'})
        socket.broadcast.emit("getofflienUser",{User_id:socket.handshake.auth.token})

        })

        // chating imlimention
        socket.on('newchat',function(data){
            socket.broadcast.emit('loadnewchat',data)
        })

        // load chat
        socket.on('extistschat',async function(data){
            let chat = await Chat.find({$or:[
                {Sender_id:data.Sender_id,Receiver_id:data.Receiver_id},
                {Sender_id:data.Receiver_id,Receiver_id:data.Sender_id},

            ]})
            socket.emit("loadchats",{chat:chat})
        })
    })
    app.use(User_router)

server.listen(9000,()=>{
    database()
    console.log(`Server Start ${process.env.PORT}`);
})