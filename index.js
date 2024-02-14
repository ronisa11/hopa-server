const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = 3000

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json()); 


const msgHistory = []; 




const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user connecting ${socket.id}`);
   
    const idFromServer = ()=> {
        const dateString = Date.now().toString(36)
        const randomness = Math.random().toString(10)
        return dateString + randomness

        
    }
   const finalId =  idFromServer()
    socket.emit("idToUser" ,finalId );

    // socket.on('clientMessage', (msg) => {
    //     msgHistory.push(msg)
    //     console.log('Received message:',  socket.id , ": ", msg , msgHistory);
      
    //   });

    socket.on('clientMessage', (content) => {
        const msg = {
            // id: idFromServer(), // יצירת זיהוי ייחודי להודעה
            content: content,
            sender: socket.id, // או זיהוי אחר של השולח, אם יש לך
            time: new Date().toISOString() // שמירת זמן השליחה
        };
        msgHistory.push(msg);
        console.log('Received message:', socket.id, ": ", msg, msgHistory);
    });

    socket.emit("msgHistory", msgHistory);

    socket.emit("serverMessage", "very nice");




      socket.on('disconnect', ()=> {
        console.log(`user disconnected ${socket.id}`);

      });



});



httpServer.listen(PORT, () => console.log(`*** 🌡️ server is up 🌡️ ***${PORT}`));