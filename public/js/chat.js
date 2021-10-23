const socket = io();
const form = document.getElementById('form');
const input = document.getElementById("message");
const sendLocationButton = document.getElementById("send-location");

form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    const message = input.value;
    socket.emit("sendMessage", message);
})

socket.on('message', (message) => {
    console.log(message);
})


sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) return alert('Geolocation is not supported by your browser');

    navigator.geolocation.getCurrentPosition((position) => {
        const {longitude, latitude } = position.coords;
        socket.emit("sendLocation", {longitude, latitude});
    })
})