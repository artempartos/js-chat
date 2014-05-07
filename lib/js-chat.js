var express = require("express");
var cons = require("consolidate");
var app = express();
var chance = require('chance');
var haml = require('hamljs');
var port = 8081;
var uuid = require('node-uuid');

var usernames = {};
var rooms = [];
var history = {};

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', "haml");
app.engine('haml', cons.haml);

app.get("/", function(req, res){
    res.render("home.html.haml");
});

app.get("/rooms/:roomId", function(req, res){
    if(rooms.indexOf(req.params.roomId) != -1) {
      res.render("room.html.haml");
    } else {
      res.send("there are no room this id" + req.params.roomId);
    }
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
    socket.emit('rooms', { rooms: rooms});

    socket.on('create_room', function (data) {
        new_room = uuid.v1();
        rooms.push(new_room);
        history[new_room] = [];
        io.sockets.emit('rooms', {rooms: rooms});
        io.sockets.socket(socket.id).emit('redirect', {url: "/rooms/" + new_room});
    });

    socket.on('sign_me', function (data) {
        seed = Math.random() * 1000;
        color = chance.Chance(seed).color();

        user = data.user;
        room = data.room;

        socket.user = user;
        socket.room = room;
        socket.usercolor = color;

        usernames[user] = user;
        socket.join(room);

        for(var i=0; i<history[room].length; i++) {
            io.sockets.socket(socket.id).emit('message', history[room][i]);
        }

        // socket.emit('updatechat', 'SERVER', 'you have connected to room1');
        socket.broadcast.to(room).emit('updatechat', 'SERVER', user + ' has connected to this room');
        // socket.emit('updaterooms', rooms, 'room1');
        socket.emit('identity', { id: data.user, color: color });
    });

    socket.on('send', function (data) {
        props = {id: socket.user, message: data.message, color: socket.usercolor}
        history[socket.room].push(props)
        io.sockets.in(socket.room).emit('message', props);
    });

});