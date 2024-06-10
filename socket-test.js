// const { io } = require("socket.io-client");
const io = require('socket.io-client');
const socket = io('http://localhost:3000');
socket.on("connect", () => {
    const engine = socket.io.engine;
    console.log(engine.transport.name); // in most cases, prints "polling"
});