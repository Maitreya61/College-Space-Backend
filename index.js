const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors'); 
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const papersRoutes = require('./routes/papersRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');
const socketIO = require("socket.io");
const Message = require("./models/Message");

const io = socketIO(process.env.SOCKET_PORT, {
  cors:{
    origin:"*"
  }
});
const app = express();

io.on("connection", (socket) =>{
  console.log("Connection established");


  getMostRecentMessages()
    .then(results => {
      socket.emit("mostRecentMessages", results.reverse());
    })
    .catch(error => {
      socket.emit("mostRecentMessages", []);
    });


  socket.on("newChatMessage",(data) => {
    //send event to every single connected socket
    console.log(data.username, data.message);
    try{
      const message = new Message(
        {
          username: data.username,
          message_text: data.message,
        }
      )
      message.save().then(()=>{
        io.emit("newChatMessage",{username: data.username, message_text: data.message});
      }).catch(error => console.log("error: "+error))
    }catch (e) {
      console.log("error: "+e);
    }
  });
  socket.on("disconnect",()=>{
    console.log("connection disconnected");
  });
});

async function getMostRecentMessages (){
  return await Message
    .find()
    .sort({_id:-1})
    .limit(10);
}

app.use((req, res, next) => {
  next();
});


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: 'http://localhost:5173' // Replace with your frontend origin
}));
 // Enable CORS middleware
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/papers', papersRoutes);
app.use('/resources', resourcesRoutes);




//Connecting to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(err => console.error("Database connection error:", err));

// Start the server

app.listen(process.env.HTTP_PORT,()=>console.log(`HTTP Server listening on ${process.env.HTTP_PORT}`));


