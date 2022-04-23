const express = require('express')
const app = express()

app.use(express.static('static'))
const port = process.env.PORT || 3000
const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(port)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  
// Declare the variable to hold the number of users and the matching status.
let players = {}, 
unmatched;


io.on('connection', (socket) => {
    console.log(`A user has connected. ID: ${socket.id}`);
    console.log("socket connected")
  });
  