const express = require('express');
const app = express();

app.use(express.static('static'));
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(port);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

let players = {},
  unmatched;

io.on('connection', (socket) => {
  console.log(`A user has connected. ID: ${socket.id}`);
  console.log('socket connected');
  joinGame(socket);

  if (getOpponent(socket)) {
    socket.emit('start the game', {
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit('start the game', {
      symbol: players[getOpponent(socket).id].symbol,
    });
  }

  socket.on('make.move', function (data) {
    if (!getOpponent(socket)) {
      return;
    }
    socket.emit('move.made', data);
    getOpponent(socket).emit('move.made', data);
  });

  socket.on('disconnect', function () {
    if (getOpponent(socket)) {
      getOpponent(socket).emit('player left');
    }
  });
});

function joinGame(socket) {
  players[socket.id] = {
    opponent: unmatched,

    symbol: 'X',
    socket: socket,
  };
  if (unmatched) {
    players[socket.id].symbol = 'O';
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
}

function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
}
