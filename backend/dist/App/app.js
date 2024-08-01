import { Loader } from '/App/UI/Components/Loader.js'
const socket = io('/');

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

Loader.load().then(() => {
    new Vue({
        el: "#app",
        data() {
            return {
                minPlayers: 2,
                maxPlayers: 5,
                playTime: 0,
                complexity: -1,
                learned: 1,
                played: 1,
                games: [],
                rating: -1,
                filter: '',
                voted: [false, false, false],
                votingRoomId: null,

                votes: [],
                totalUsers: 0,
                votesCount: 0,
                maxVotes: 2,

                showResults: false,
                results: [],
                winnerGame: null,
            };
        },
        computed: {
          isReadyToSendVotes() {
            return this.voted.filter(game => game).length == 3
          },

          filteredGames() {
            return this.games.filter(game => {
              let isValid = (
                !this.maxPlayers ||
                (
                  game.minPlayers <= this.maxPlayers &&
                  game.maxPlayers >= this.maxPlayers
                )
              )

              if (this.playTime > -1) {
                switch (this.playTime) {
                  case 1: isValid = isValid && game.time <= 15; break;
                  case 2: isValid = isValid && game.time > 15 && game.time <= 30; break;
                  case 3: isValid = isValid && game.time > 30; break;
                }
              }

              if (this.complexity > -1) {
                switch (this.complexity) {
                  case 1: isValid = isValid && game.complexity <= 2; break;
                  case 2: isValid = isValid && game.complexity > 2 && game.complexity <= 3; break;
                  case 3: isValid = isValid && game.complexity > 3; break;
                }
              }

              if (this.played > -1) {
                isValid = isValid && (this.played == 0 ? !game.played : game.played)
              }

              if (this.learned > -1) {
                isValid = isValid && (this.learned == 0 ? !game.learned : game.learned)
              }

              if (this.rating > -1) {
                isValid = isValid && (game.rate == this.rating)
              }

              if (this.filter) {
                isValid = isValid && (
                  game.name.toLowerCase().includes(this.filter.toLowerCase()) ||
                  game.title.toLowerCase().includes(this.filter.toLowerCase())
                )
              }

              return isValid
            }).sort((a, b) => {
              return a.name > b.name ? 1 : -1
            })
          }
        },
        mounted() {
            fetch('https://raw.githubusercontent.com/rpopuc/bga-games-data/main/games.json?date=' + Date.now())
              .then(response => response.json())
              .then(games => {
                this.games = games
              })

            this.hookVotingRoom()
            this.enterVotingRoom()
        },

        watch: {
        },

        methods: {
          joinRoom(votingRoomId) {
            if (!votingRoomId) {
              return
            }

            console.log('Trying to enter room', votingRoomId);
            socket.emit('join_room', votingRoomId, (success) => {
              if (!success) {
                console.log('Failed to join room', votingRoomId);
                this.joinError = 'Falha ao entrar na sala. Verifique o ID da sala.';
                window.history.replaceState({}, '', '/');
                return
              }

              console.log('Joined room', votingRoomId);
              this.votingRoomId = votingRoomId;
              this.joinError = null;
              window.history.pushState({}, '', `?id=${votingRoomId}`);
            });
          },

          enterVotingRoom() {
            const queryRoomId = getQueryParameter('id');
            if (!queryRoomId) {
              return
            }

            this.joinRoom(queryRoomId);
          },

          hookVotingRoom() {
            socket.on('voting_result', (votes) => {
              this.votes = votes;
              this.voted = [false, false, false];
              this.votingRoomId = null;
              window.history.pushState({}, '', '/');
              this.results = votes;
              this.winnerGame = this.games.find(game => game.name == votes[0][0]);
              this.showResults = true;
            });

            socket.on('room_info', (info) => {
              this.totalUsers = info.totalUsers;
              this.votesCount = info.votesCount;
              this.maxVotes = info.maxVotes;
              this.maxPlayers = info.maxVotes
            });
          },

          createVotingRoom() {
            if (this.votingRoomId) {
              return
            }

            console.log('Trying to create room')
            socket.emit('create_room', this.maxPlayers, (roomId) => {
              console.log('Created room', roomId)
              this.votingRoomId = roomId
              window.history.pushState({}, '', `?id=${roomId}`)
            });
          },

          vote(newGame) {
            if (!this.votingRoomId) {
              return
            }

            if (this.voted.findIndex(slot => slot.name == newGame.name) != -1) {
              return
            }

            const idx = this.voted.findIndex(slot => slot == false)

            if (idx == -1) {
              return
            }

            this.voted = this.voted.map((game, gameIdx) => gameIdx == idx ? newGame : game)
          },

          unvote(game) {
            const idx = this.voted.findIndex(slot => slot.name == game.name)

            if (!this.voted[idx]) {
              return
            }

            this.voted = this.voted.slice(0, idx).concat(this.voted.slice(idx + 1))
            setTimeout(() => {
              while (this.voted.length < 3) {
                this.voted.push(false)
              }
            }, 200)
          },

          sendVotes() {
            const count = this.voted.filter(game => game).length
            if (count < 3) {
              return
            }

            const votes = this.voted.map(game => game.name)

            socket.emit('send_vote', this.votingRoomId, votes, (success) => {
              if (!success) {
                alert('Falha ao enviar o voto');
                return
              }
              //this.hasVoted = true;
            });
          }
        },
    });
})