const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = 3000;

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

  const idFromServer = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2); // שימו לב ששיניתי גם כאן קצת את הקוד כדי להחזיר רק את החלק האקראי, מבלי לכלול את ה"0." בתחילת המספר האקראי
    return dateString + randomness;
  };
  const finalId = idFromServer();
  socket.emit("idToUser", finalId);

  socket.on("clientMessage", (content) => {
    const msg = {
      content: content,
      sender: finalId,
      time: new Date().toISOString(),
    };
    msgHistory.push(msg);
    console.log("Received message:", socket.id, ":", msg, msgHistory);
    io.emit("newMessage", msg);
  });

  socket.emit("serverMessage", "very nice");




      socket.on('disconnect', ()=> {
        console.log(`user disconnected ${socket.id}`);

      });



});

httpServer.listen(PORT, () => console.log(`*** 🌡 server is up 🌡 ***${PORT}`));
