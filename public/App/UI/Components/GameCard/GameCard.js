export default
{
    definition: {
        props: {
            game: {
                type: Object,
                default: {},
            },
            isBlank: {
                type: Boolean,
                default: false
            },
            useLink: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            getName() {
                return this.game.name;
            },

            click() {
                if (this.useLink) {
                    window.open(this.game.link, '_blank');
                    return
                }

                this.$emit('click')
            },

            getBackground() {
                if (this.isBlank) {
                    return ''
                }

                return `bg-[url('https://x.boardgamearena.net/data/gamemedia/${this.game.name}/banner/default_500.jpg?h=1651658186')]`;
            }
        },
    },
}