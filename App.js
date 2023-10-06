const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://arafat-react.vercel.app"
    },
    path: '/socket.io',
    transports: ['websocket'],
    secure: true,
});


// Serve your React.js application from here, or you can create a separate Express route for it.

app.use(cors());


io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle socket events here
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Broadcast the message to all connected clients
        io.emit('message', data);
    });
    // Join room 
    socket.on('joinRoom', (RoomId) => {
        socket.join(RoomId);
        socket.to(RoomId).emit("newJoinMessage", "New user join this meeting");
    })


    // offer 
    socket.on("sendTheOffer", (offer, RoomId) => {
        socket.to(RoomId).emit("reciveOffer", offer);
    })

    // send the answer 
    socket.on("sendTheAnswer", (answer, RoomId) => {
        socket.to(RoomId).emit("reciveAnswer", answer);
    })

    // send the icecandidate
    socket.on("sendIcecandidate", (icecandidate, RoomId) => {
        socket.to(RoomId).emit("reciveIcecandidate", icecandidate);
    })



    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/', (req, res) => {
    res.send("Updated server 8th")
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});