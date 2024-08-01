export default
{
    definition: {
        props: {
            minPlayers: {
                type: Number,
                default: 1,
            },
            maxPlayers: {
                type: Number,
                default: 1,
            },
            time: {
                type: Number,
                default: 0,
            },
            complexity: {
                type: Number,
                default: 1,
            },
            learned: {
                type: Boolean,
                default: false,
            },
            played: {
                type: Boolean,
                default: false,
            },
            rate: {
                type: Number,
                default: 1,
            },
            name: {
                type: String,
                default: '',
            },
            title: {
                type: String,
                default: '',
            },
            link: {
                type: String,
                default: '',
            },
            isBlank: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getName() {
                return this.name;
            },

            click() {
                this.$emit('click')
            },

            getBackground() {
                if (this.isBlank) {
                    return ''
                }

                return `bg-[url('https://x.boardgamearena.net/data/gamemedia/${this.name}/banner/default_500.jpg?h=1651658186')]`;
            }
        },
        mounted() {
        }
    },
}