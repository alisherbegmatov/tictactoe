const express = require('express')
const app = express()

app.use(express.static('static'))
const port = process.env.PORT || 5000
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(port)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  
