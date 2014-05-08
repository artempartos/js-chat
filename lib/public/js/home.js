$(document).ready(function() {

    var socket = io.connect(window.location.hostname);
    var roomButton = document.getElementById("create");
    var room = document.getElementById("rooms");
    var login = document.getElementById("login");
    var alert = document.getElementById("login_alert");
    var rooms = []

    socket.on('rooms', function (data) {
        if(data.rooms) {
            rooms = data.rooms;
            format_rooms(rooms);
        } else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('redirect', function (data) {
        params = "?login=" + login.value
        self.location=data.url + params;
    });

    login.onchange = function(data) {
        format_rooms(rooms);
    };

    roomButton.onclick = function() {
        if(login.value != "") {
            alert.classList.add("hidden");
            socket.emit('create_room');
        } else
        {
            alert.classList.remove("hidden");
        }
    };

function format_rooms(rooms) {
    var html = [];
    alert.classList.add("hidden");
    rooms.forEach( function(room) {
        html.push("<div class='room_item'><span class= 'label'><a href=", "/rooms/", room, "?login=", login.value, ">", room, "</a></span></div>") ;
    })
    room.innerHTML = html.join('');
}

})