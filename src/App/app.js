console.clear()

import { Loader } from '/src/App/UI/Components/Loader.js'
import { Engine } from '/src/Lib/Engine.js'

Loader.load().then(() => {
    new Vue({
        el: "#app",
        data() {
            return {
                minPlayers: 2,
                maxPlayers: 6,
                learned: 1,
                played: 1,
                games: []
            };
        },
        computed: {
          filteredGames() {
            return this.games.filter(game => {
              let isValid = (
                game.minPlayers <= this.maxPlayers &&
                game.maxPlayers >= this.maxPlayers
              )

              if (this.played > -1) {
                isValid = isValid && (this.played == 0 ? !game.played : game.played)
              }

              if (this.learned > -1) {
                isValid = isValid && (this.learned == 0 ? !game.learned : game.learned)
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
        methods: {
          clickOnMessage() {
            const engine = new Engine('!oot dohtem a morf skrow tI')
            this.message = engine.getInvertedMessage()
          }
        },
    });
})