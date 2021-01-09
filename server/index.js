var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

server.listen(port, function(){
	console.log("Server is now running...");
});

io.on('connection', (socket) => {
    console.log("Player connectado ID: " +  socket.id );

    socket.on('disconnect', function(){
        console.log("Player Disconnected ID: " +  socket.id );
        for(var i = 0; i < jogadores.length; i++){
            if(jogadores[i].id == socket.id){
                jogadores.splice(i, 1);
                io.emit('numeroJogadoresMudou', { numero: jogadores.length });
            }
        }
    });
});