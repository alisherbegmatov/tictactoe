const socket = io();
let symbol;
socket.on('connect', () => {
  console.log(`A user has connected. ID: ${socket.id}`);
});

$(function () {
  $('.board button').attr('disabled', true);
  $('.board> button').on('click', makeMove);
  socket.on('move.made', function (data) {
    $('#' + data.position).text(data.symbol);

    myTurn = data.symbol !== symbol;

    if (!isGameOver()) {
      if (gameTied()) {
        $('#messages').text('No winners!');
        $('.board button').attr('disabled', true);
      } else {
        renderTurnMessage();
      }
    } else {
      if (myTurn) {
        $('#messages').text('You lost!');
      } else {
        $('#messages').text('You won!');
      }
      $('.board button').attr('disabled', true);
    }
  });
  socket.on('start the game', function (data) {
    symbol = data.symbol;
    myTurn = symbol === 'X';
    renderTurnMessage();
  });
  socket.on('player left', function () {
    $('#messages').text('2nd Player has left the game');
    $('.board button').attr('disabled', true);
  });
});

function getBoardState() {
  var obj = {};
  $('.board button').each(function () {
    obj[$(this).attr('id')] = $(this).text() || '';
  });
  return obj;
}

function gameTied() {
  var state = getBoardState();

  if (
    state.a0 !== '' &&
    state.a1 !== '' &&
    state.a2 !== '' &&
    state.b0 !== '' &&
    state.b1 !== '' &&
    state.b2 !== '' &&
    state.b3 !== '' &&
    state.c0 !== '' &&
    state.c1 !== '' &&
    state.c2 !== ''
  ) {
    return true;
  }
}

function isGameOver() {
  var state = getBoardState(),
    matches = ['XXX', 'OOO'],
    rows = [
      state.a0 + state.a1 + state.a2,
      state.b0 + state.b1 + state.b2,
      state.c0 + state.c1 + state.c2,
      state.a0 + state.b1 + state.c2,
      state.a2 + state.b1 + state.c0,
      state.a0 + state.b0 + state.c0,
      state.a1 + state.b1 + state.c1,
      state.a2 + state.b2 + state.c2,
    ];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === matches[0] || rows[i] === matches[1]) {
      return true;
    }
  }
}

function renderTurnMessage() {
  if (!myTurn) {
    $('#messages').text('2nd players turn');
    $('.board button').attr('disabled', true);
  } else {
    $('#messages').text('Your turn');
    $('.board button').removeAttr('disabled');
  }
}

function makeMove(e) {
  e.preventDefault();
  if (!myTurn) {
    return;
  }
  if ($(this).text().length) {
    return;
  }
  socket.emit('make.move', {
    symbol: symbol,
    position: $(this).attr('id'),
  });
}
