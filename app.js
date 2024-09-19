const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
    console.log("Client connected:", socket.id);

    socket.on("send-location", (coords) => {
        console.log("Location received:", coords);
        // Broadcast the location to all connected clients
        io.emit("receive-location", { id: socket.id, ...coords });
    });

    socket.on("disconnect", function() {
        io.emit("Client disconnected:", socket.id);
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
