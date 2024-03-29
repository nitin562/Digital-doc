const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const mongoConnect = require("./connectDb");
const { extractIdForMiddleware, setToken } = require("./MWR/helper");

mongoConnect();
require("dotenv").config();
//express
const app = express();
const cookieParser = require("cookie-parser");
const httpServer = http.createServer(app);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true, //for cookies
    origin: process.env.origin,
  })
);
app.use("/api/auth", require("./API/user"));
app.use("/api/data", extractIdForMiddleware, require("./API/Data"));

const io = new Server(httpServer, {
  cors: {
    origin: process.env.origin,
    methods: ["*"],
  },
});
let admin = new Map();
//io worker
io.on("connection", (socket) => {
  socket.on("connectRoom", async (room_id, email) => {

    if (admin.has(room_id)) {
      const adminId = admin.get(room_id);
      try {
        const response = await io
          .to(adminId)
          .timeout(7000)
          .emitWithAck("GetConnectReq", socket.id, email);
      
      } catch (error) {
    
        socket.emit("ConnectionTimeout");
      }
    } else {
      socket.join(room_id);
      admin.set(room_id, socket.id); // you are the admin who is creating room first
      //notify the connector

      socket.emit("Connected", "self", room_id);
    }
    
  });
  socket.on("disconnectRoom", async (url, email, currentUsers) => {
    //save Mechanism is not implemented yet
   
    if (currentUsers[email].admin===true) {
      admin.delete(url);
      socket.leave(url);
      if(Object.keys(currentUsers).length>1){
        const newAdminId=Array.from(io.sockets.adapter.rooms.get(url))[0]
        admin.set(url,newAdminId)
        const response=await io.to(newAdminId).timeout(7000).emitWithAck("YouAreAdminNow")
  
        delete currentUsers[email]
        currentUsers[response[0].email].admin=true
        socket.broadcast.to(url).emit("getuserConnected",currentUsers,email)
      }
      
      
      socket.emit("disconnected");
   
    } else {
      if(!socket.rooms.has(url)){
    
        return
      }
      socket.leave(url);

      socket.emit("disconnected");
        delete currentUsers[email]
     
      socket.broadcast.to(url).emit("otherLeaved", email,currentUsers); //
    }
  });
  socket.on("NotAllowed", (id, url) => {
    io.to(id).emit("NotAllowedToConnect", url);
  });
  socket.on("AllowedToConnect", async (id,title, content, room_id, connectedUser,alreadyColors) => {
    // id is other's id. event is handled in admin socket instance
    // to get other's socket as we need it to make him join to the room
    const socketOfOther = io.sockets.sockets.get(id);
    socketOfOther.join(room_id);

    try {
      const response = await io
        .to(id)
        .timeout(7000)
        .emitWithAck("Connected","connect to other", room_id);
    
      if (response) {
 
        connectedUser[response[0].email]={
            name:response[0].name,
            admin:false,
            Token:response[0].token,
            cursor:{
              top:0,
              left:0
            }
        }
        alreadyColors[response[0].email]=null
      
        // console.log(newCollabArr,response)
        io.to(room_id).emit("getuserConnected", connectedUser,response[0].email,alreadyColors); //
      }
    } catch (error) {
      console.log("error", error);
    }

    socket.to(id).emit("AllowingToConnect",title, content, room_id);
  });
  // socket.on("dummy",(a,b)=>{
  //   console.log("values",a,b)
  // })
  socket.on("Send-change", (delta, id, pos,email) => {
  

  
    if (socket.rooms.has(id)) {
   
      
      socket.broadcast.to(id).emit("recieve-change", delta, pos,email);
    }
  });
  socket.on("title-change",(title,url)=>{
    socket.broadcast.to(url).emit("titleChanged",title)
  })
});

//http Server runner
let port=process.env.PORT
httpServer.listen(port, () => {
  console.log("Server Started at http://localhost:8000");
});
