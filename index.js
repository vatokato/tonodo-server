const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const { mongoHost, mongoPort, mongoDB, mongoUser, mongoPassword, port } = require('./config.js');

const router = require('./router/');

console.log(mongoUser, mongoPassword)

mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: mongoUser,
  pass: mongoPassword,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

const users = new Map();
io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;
  if (users.has(userId)) {
    socket.join(users.get(userId));
  } else {
    users.set(userId, socket.id);
  }
  const roomId = users.get(userId);

  socket.emit('message', `your id = ${socket.id}`);

  socket.on('syncFolders', () => {
    socket.broadcast.to(roomId).emit('syncFolders');
  });

  socket.on('syncTasks', () => {
    socket.broadcast.to(roomId).emit('syncTasks');
  });

  socket.on('disconnect', () => {
    const room = io.sockets.adapter.rooms[roomId];
    const countOfRoom = room && room.length;
    if (!countOfRoom) {
      users.delete(userId);
    }
  });

  socket.on('reconnect', () => {
    console.log(`reconnect ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server has been started! http://localhost:${port}`);
});
