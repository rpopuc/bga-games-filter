const { v4: uuidv4 } = require('uuid');

class RoomManager
{
    constructor()
    {
        this.rooms = {}
    }

    createRoom(maxVotes, userId)
    {
        if (maxVotes <= 1) {
            return null
        }

        const roomId = uuidv4();
        this.rooms[roomId] = { votes: [], users: [userId], maxVotes: parseInt(maxVotes) };

        return roomId
    }

    joinRoom(roomId, userId)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        this.rooms[roomId].users.push(userId);

        return true
    }

    leaveRoom(roomId, userId)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        this.rooms[roomId].users = this.rooms[roomId].users.filter(u => u !== userId);
        this.rooms[roomId].votes = this.rooms[roomId].votes.filter(v => v.userId !== userId);

        return true
    }

    vote(roomId, userId, vote)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        this.rooms[roomId].votes.push({userId, vote});

        return true
    }

    isVotingCompleted(roomId)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        return this.rooms[roomId].votes.length === this.rooms[roomId].maxVotes
    }

    destroyRoom(roomId)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        delete this.rooms[roomId]
    }

    isRoomEmpty(roomId)
    {
        if (!this.rooms[roomId]) {
            return true
        }

        return this.rooms[roomId].users.length === 0
    }

    roomsCount()
    {
        return Object.keys(this.rooms).length
    }

    leaveAllRooms(userId)
    {
        const rooms = []

        for (let roomId in this.rooms) {
            let left = this.leaveRoom(roomId, userId)

            if (left) {
                rooms.push(roomId)
            }
        }

        return rooms
    }

    destroyEmptyRooms()
    {
        for (let roomId in this.rooms) {
            if (!this.isRoomEmpty(roomId)) {
                continue
            }

            this.destroyRoom(roomId)
        }
    }

    roomExists(roomId)
    {
        return !!this.rooms[roomId]
    }

    getRoom(roomId)
    {
        return this.rooms[roomId]
    }

    getVotes(roomId)
    {
        if (!this.rooms[roomId]) {
            return []
        }

        const result = []

        this.rooms[roomId].votes.map(v => {
            result.push(v.vote)
        })

        return result
    }

    getResults(allVotes)
    {
        const tableOfPoints = {0: 4, 1: 2, 2: 1}
        const points = {}

        for (let votes of allVotes) {
            votes.map((vote, idx) => {
                points[vote] = (points[vote] ?? 0) + tableOfPoints[idx]
            })
        }

        // Sort results by value
        const sortedPoints = Object.entries(points).sort((a, b) => b[1] - a[1])

        return sortedPoints
    }

}

module.exports = new RoomManager