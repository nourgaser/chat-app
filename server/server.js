const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
  },
});

const usernames = [];

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  socket.once("register-username", (username) => {
    usernames[socket.id] = username;
    socket.broadcast.emit('recieveMessage', {
      sender: "Server",
      room: "Internal",
      content: username + " joined the server."
    });
  });

  socket.on("sendMessage", (msg) => {
    msg.sender = usernames[socket.id];
    if (msg.room != "") {
      socket.to(msg.room).emit("recieveMessage", msg);
    } else {
      socket.broadcast.emit("recieveMessage", msg);
    }
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.emit("recieveMessage", {
      content: "You joined room " + room + ".",
      sender: "Server",
      room: "Internal",
    });
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnect.`);
    socket.broadcast.emit('recieveMessage', {
      sender: "Server",
      room: "Internal",
      content: usernames[socket.id] + " left the server."
    });
    delete usernames[socket.id];
  });
});

console.log("Now listening on port 3000...");
