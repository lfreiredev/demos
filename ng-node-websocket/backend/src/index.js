const express = require('express');
const app = express();

const server = require('http').Server(app);
const options = {
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
};
const io = require('socket.io')(server, options);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('user connected');
  //   io.emit('new-message', 'user connected');

  socket.on('new-message', (message) => {
    console.log(message);
    socket.emit('new-message', message);
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
