const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const roomManager = require('./lib/RoomManager');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('create_room', (maxVotes, callback) => {
    const roomId = roomManager.createRoom(maxVotes, socket.id);
    if (roomId === null) {
        callback(false)
    }
    console.log('Created room', roomId, {totalRooms: roomManager.roomsCount()});
    socket.join(roomId);
    callback(roomId);
    updateRoomInfo(roomId);
  });

  socket.on('join_room', (roomId, callback) => {
    if (!roomManager.roomExists(roomId)) {
        callback(false)
    }

    socket.join(roomId);
    roomManager.joinRoom(roomId, socket.id);
    callback(true);
    setTimeout(() => {
        updateRoomInfo(roomId);
    }, 100);
  });

  socket.on('send_vote', (roomId, vote, callback) => {
    if (!roomManager.roomExists(roomId)) {
        callback(false)
    }

    roomManager.vote(roomId, socket.id, vote);
    updateRoomInfo(roomId);

    if (roomManager.isVotingCompleted(roomId)) {
        const votes = roomManager.getVotes(roomId)
        console.log({votes})
        console.log('All votes received', votes);
        const results = roomManager.getResults(votes)
        console.log({results})
        io.in(roomId).emit('voting_result', results);
        roomManager.destroyRoom(roomId);
        console.log('Deleted room', roomId, {totalRooms: roomManager.roomsCount()});
    }

    callback(true);
  });

  socket.on('disconnect', () => {
    const rooms = roomManager.leaveAllRooms(socket.id);
    roomManager.destroyEmptyRooms();
    for (let roomId of rooms) {
        updateRoomInfo(roomId);
    }
  });

  function updateRoomInfo(roomId) {
    if (!roomManager.roomExists(roomId)) {
        console.log('Room not found', roomId);
        return
    }

    const room = roomManager.getRoom(roomId);

    const info = {
        totalUsers: room.users.length,
        votesCount: room.votes.length,
        maxVotes: room.maxVotes
    }
    console.log('Updating room info', roomId, info);
    io.in(roomId).emit('room_info', info);
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
