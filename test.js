const roomManager = require('./lib/RoomManager.js')

const votes = [
    [ 'alhambra', 'kingoftokyo', 'dobble' ],
    [ 'kingoftokyo', 'alhambra', 'dobble' ]
]

console.log(roomManager.getResults(votes))