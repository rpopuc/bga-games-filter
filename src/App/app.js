console.clear()

import { Loader } from '/App/UI/Components/Loader.js'

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
            };
        },
        computed: {
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
        },

        watch: {
        },

        methods: {
        },
    });
})