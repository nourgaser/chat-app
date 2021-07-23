const sendButton = document.getElementById("sendButton");
const joinButton = document.getElementById("joinButton");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const chatContainer = document.getElementById("chat-container");
const socket = io("http://localhost:3000");

const username = prompt("What's your name?");

socket.on("connect", () => {
  if (username.trim() === "" || username === null) username = "anonymous";
  socket.emit("register-username", username);
  chatContainer.innerHTML += `<p><strong>You joined the server with the username ${username}.</strong></p>`;
});

socket.on("recieveMessage", (msg) => {
  addMessage({sender: "You", room: msg.room, message: msg.content}); 
});

sendButton.addEventListener("click", (e) => {
  if (messageInput.value.trim() != "") {
    let msg = {
      content: messageInput.value.trim(),
      room: roomInput.value.trim(),
    };
    socket.emit("sendMessage", msg);
    addMessage({sender: "You", room: msg.room, message: msg.content});
    messageInput.value = "";
  }
});

joinButton.addEventListener("click", (e) => {
  socket.emit("joinRoom", roomInput.value);
});

var addMessage = ({sender, room, message}) => {
  chatContainer.innerHTML += `<p><strong>${sender}@${(room === '')?'Public':room}:</strong> ${message}</p>`;
};
