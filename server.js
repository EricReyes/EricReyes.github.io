var server = new Firebase ("https://radiant-inferno-8296.firebaseio.com/");

$("#send").click(function(event) {
    sendText(window.name);
});
$("#textBox").keypress(function(event) {
    if(event.which == 13 || event.keyCode == 13) {
        event.preventDefault();
        sendText(window.name);
    }
});
$("#reset").click(function(event) {
    server.remove();
});

function getText() {
    server.on('child_added', function (snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
    });
    server.on('child_removed', function (snapshot) {
        $('#chatBox').text("");
    });
}
function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#chatBox'));
        $('#chatBox')[0].scrollTop = $('#chatBox')[0].scrollHeight;
        
      };
function sendText(nombre) {
    if($("#textBox").val() != "") {
       var text = $("#textBox").val();
       server.push({name: nombre, text: text}); //ya  SE CAMBIA EL NOMBRE !!!!
       $("#textBox").val("");
    }
}


getText();