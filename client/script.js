const button = document.getElementById("submit");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const chatContainer = document.getElementById("chat-container");
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`Connected with ID: ${socket.id}.`);
});

socket.on("recieveMessage", (msg) => {
  if (msg.room != "") {
    chatContainer.innerHTML += `<p>${msg.sender} - ${msg.room}: ${msg.content}`;
  } else {
    chatContainer.innerHTML += `<p>${msg.sender} - Public: ${msg.content}`;
  }
});

button.addEventListener("click", (e) => {
  if (messageInput.value != "") {
    let msg = {
      content: messageInput.value,
      room: roomInput.value,
      sender: socket.id,
    };

    socket.emit("sendMessage", msg);

    if (msg.room != "") {
      chatContainer.innerHTML += `<p>You - ${msg.room}: ${msg.content}`;
    } else {
      chatContainer.innerHTML += `<p>You - Public: ${msg.content}`;
    }
    messageInput.value = "";
  }
});
