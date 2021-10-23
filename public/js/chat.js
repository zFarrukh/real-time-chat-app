const socket = io();


const form = document.getElementById('form');
const input = document.getElementById("message");
const button = document.getElementById("button");
const sendLocationButton = document.getElementById("send-location");
const divMessages = document.getElementById("messages");
const sidebar = document.getElementById("sidebar");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New message element
    const $newMessage = divMessages.lastElementChild;
    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    
    // Visibleheight
    const visibleHeight = divMessages.offsetHeight;

    // Height of messages container
    const containerHeight = divMessages.scrollHeight;

    // How far have been scrolled
    const scrollOffset = divMessages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        divMessages.scrollTop = divMessages.scrollHeight;
    }
    
}

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
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    divMessages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})  

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    divMessages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    sidebar.innerHTML = html;
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

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
});