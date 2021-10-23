const socket = io();


const form = document.getElementById('form');
const input = document.getElementById("message");
const button = document.getElementById("button");
const sendLocationButton = document.getElementById("send-location");
const divMessages = document.getElementById("messages");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    button.setAttribute('disabled', 'disabled');
    const message = input.value;
    socket.emit("sendMessage", message, (error) => {
        button.removeAttribute('disabled');
        input.value = '';
        input.focus();
        if(error) return console.log(error);

        console.log("Message delivered");
    });
})

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    divMessages.insertAdjacentHTML('beforeend', html);
})  

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    divMessages.insertAdjacentHTML('beforeend', html);
})

sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) return alert('Geolocation is not supported by your browser');
    sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        const {longitude, latitude } = position.coords;
        socket.emit("sendLocation", {longitude, latitude}, () => {
            sendLocationButton.removeAttribute('disabled');
            console.log("Location shared!");
        });
    })
});

socket.emit('join', { username, room });