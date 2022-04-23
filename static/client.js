const socket = io();
let symbol;
socket.on("connect", () => {
    console.log(`A user has connected. ID: ${socket.id}`);
});


