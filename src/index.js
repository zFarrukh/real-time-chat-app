const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log("New web socket connection");

    socket.emit('message', "Welcome!:)");
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on("sendMessage", (message) => {
        io.emit("message", message);
    });

    socket.on("sendLocation", (position) => {
        
        socket.broadcast.emit("message", `https://google.com/maps?q=${position.latitude},${position.longitude}`);

    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left');
    });

});




server.listen(port, () => {
    console.log("Server is running on port: " + port);
});