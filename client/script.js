const sendButton = document.getElementById("sendButton");
const joinButton = document.getElementById("joinButton");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const chatContainer = document.getElementById("chat-container");
const socket = io("http://localhost:3000");

var username;
socket.on("connect", () => {
  username = prompt("What's your name?");
  if (username === "" || username === null) username = "Unknown";
  socket.emit("register-username", username);
  chatContainer.innerHTML += `<p><strong>You joined the server with the username ${username}.</strong></p>`;
});

socket.on("recieveMessage", (msg) => {
  addMessage(msg.sender, msg.room, msg.content);  
});

sendButton.addEventListener("click", (e) => {
  if (messageInput.value != "") {
    let msg = {
      content: messageInput.value,
      room: roomInput.value,
    };
    socket.emit("sendMessage", msg);
    addMessage("You", msg.room, msg.content);
    messageInput.value = "";
  }
});

joinButton.addEventListener("click", (e) => {
  socket.emit("joinRoom", roomInput.value);
});

var addMessage = (sender, room, message) => {
  chatContainer.innerHTML += `<p><strong>${sender} - ${(room === '')?'Public':room}:</strong> ${message}</p>`;
};
