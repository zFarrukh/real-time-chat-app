const socket = io();

const form = document.getElementById('form');
const input = document.getElementById("message");
form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    const message = input.value;
    socket.emit("sendMessage", message);
})

socket.on('message', (message) => {
    console.log(message);
})