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
        this.rooms[roomId] = {
            votes: [],
            users: [userId],
            maxVotes: parseInt(maxVotes),
            selectedGames: [],
        };

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
        this.rooms[roomId].selectedGames = this.rooms[roomId].selectedGames.filter(v => v.userId !== userId);

        return true
    }

    select(roomId, userId, vote)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        this.rooms[roomId].selectedGames.push({userId, vote});

        return true
    }

    unselect(roomId, userId, vote)
    {
        if (!this.rooms[roomId]) {
            return false
        }

        this.rooms[roomId].selectedGames = this.rooms[roomId]
            .selectedGames.filter(v => v.userId !== userId || v.vote !== vote);

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

    sortResults(results) {
        return results.sort((a, b) => b.points - a.points);
    }

    getSortString(vote)
    {
        return vote.weight.toString().padStart(4, '0') + '-'
             + vote.points.toString().padStart(4, '0') + '-'
             + vote.votes.toString().padStart(4, '0')
    }

    getResults(allVotes) {
        const tableOfPoints = {0: 3, 1: 2, 2: 1};
        const points = {};

        for (const votes of allVotes) {
            votes.forEach((vote, idx) => {
                if (!points[vote]) {
                    points[vote] = {name: vote, points: 0, votes: 0, weight: 0, sortString: '', idx: []};
                }

                const current = points[vote];
                const point = tableOfPoints[idx];

                current.idx.push(point);
                current.points += point;
                current.votes += 1;
                current.weight = current.points * current.votes;
                current.sortString = this.getSortString(current);
            });
        }

        let results = this.sortResults(Object.values(points));
        const winner = results[0];
        const draw = results.filter(result => result.sortString === winner.sortString);

        if (draw.length > 1) {
            const randomDrawWinner = draw[Math.floor(Math.random() * draw.length)];
            randomDrawWinner.points += 1;
            randomDrawWinner.sortString = this.getSortString(randomDrawWinner);

            results = results.filter(result => result.name !== randomDrawWinner.name);
            results.push({...randomDrawWinner, draw: true});
        }

        return this.sortResults(results).map(
            ({name, points, votes, draw}) => ({name, points, votes, draw})
        );
    }
}

module.exports = new RoomManager