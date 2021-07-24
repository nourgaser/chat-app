const sendButton = document.getElementById("sendButton");
const joinButton = document.getElementById("joinButton");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const chatContainer = document.getElementById("chat-container");
const socket = io("http://localhost:3000");

// wait for username input before connecting to socket
// TODO: remove the next line once setUsername() is implemented
document.querySelector('.init').style.display = 'none';

var username = /*'anonymous';*/ prompt("What's your name?");

document.querySelector('.username-btn').addEventListener('click', () => {
  username = document.querySelector('.username-input').value;
  document.querySelector('.init').style.display = 'none';
  // document.querySelector('main').style.filter = 'none';
  console.log(username);
});

socket.on("connect", () => {
  if (username.trim() === "" || username === null) username = "anonymous";
  socket.emit("register-username", username);
  chatContainer.innerHTML += `<p><strong>You joined the server with the username ${username}.</strong></p>`;
});

socket.on("recieveMessage", (msg) => {
  addMessage({sender: msg.sender, room: msg.room, message: msg.content}); 
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
  chatContainer.innerHTML += `<p class='message ${(sender === 'You')?'self':'other'}'><strong>${sender}@${(room === '')?'Public':room}:</strong> ${message}</p>`;
};
