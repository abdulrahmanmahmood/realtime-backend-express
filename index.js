const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("chat message", (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    io.emit("send_messages_to_all_users", msg);
    // socket.broadcast.emit("send_messages_to_all_users", msg);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
