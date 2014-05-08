$(document).ready(function() {

    var messages = [];
    var socket = io.connect(window.location.hostname);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var client_id = document.getElementById("client_id");
    var color_id = document.getElementById("color_id");
    var room = document.location.pathname.split('/').pop();
    var username = GetURLParameter("login");

    if (username != "" && username != undefined) {
        socket.emit('sign_me', {room: room, user: username});
    } else {
        alert("you are not logged in!");
    }

    socket.on('identity', function (data) {
        client_id.value = data.id;
        color_id.value = data.color;
    });

    socket.on('message', function (data) {
        if(data.message) {
            messages.push([data.id, data.message, data.color]);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html +=  "<strong><font color=" +messages[i][2] + ">" + messages[i][0] + "</font></strong> :  " + messages[i][1] + "<br />";
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = sendMessage;


    function sendMessage() {
        var text = field.value;
        if (text != '') {
            socket.emit('send', { message: text });
            field.value = '';
        }
    }

    key('⌘+enter,enter', sendMessage);
    key.filter = function(event){
        var tagName = (event.target || event.srcElement).tagName;
        key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
        return true;
    }

})

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}