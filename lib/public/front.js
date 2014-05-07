$(document).ready(function() {

    var messages = [];
    var socket = io.connect('http://localhost:8081');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    console.log(sendButton);
    var content = document.getElementById("content");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html +=  "<strong>" + messages[i] + "<strong/>" + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function() {
        var text = field.value;
        field.value = '';
        socket.emit('send', { message: text });
    };
})