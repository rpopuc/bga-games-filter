console.clear()

import { Loader } from '/App/UI/Components/Loader.js'

Loader.load().then(() => {
    new Vue({
        el: "#app",
        data() {
            return {
                minPlayers: 2,
                maxPlayers: 6,
                learned: 1,
                played: 1,
                games: [],
                filter: ''
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

              if (this.played > -1) {
                isValid = isValid && (this.played == 0 ? !game.played : game.played)
              }

              if (this.learned > -1) {
                isValid = isValid && (this.learned == 0 ? !game.learned : game.learned)
              }

              if (this.filter) {
                isValid = isValid && game.name.toLowerCase().includes(this.filter.toLowerCase())
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
          filter() {
            this.$nextTick(() => {
              this.$refs.games.scrollTop = 0
            })
          }
        },

        methods: {
        },
    });
})