const io = require("socket.io")(3000, {
  cors: {
    origin: [
      "http://localhost:5500",
      "http://localhost:5050",
    ],
  },
});
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  
  socket.on('sendMessage', msg => {
    if (msg.room != "") {
      socket.to(msg.room).emit("recieveMessage", msg);
    }
    else {
      socket.broadcast.emit("recieveMessage", msg);
    }
  });
  
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnect.`);
  });
});

console.log("Now listening on port 3000...");
