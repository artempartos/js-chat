var express = require("express");
var cons = require("consolidate");
var app = express();
var haml = require('hamljs');
var port = 8081;


app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', "haml");
app.engine('haml', cons.haml);

app.get("/", function(req, res){
    res.render("main.html.haml");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to Partos chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});