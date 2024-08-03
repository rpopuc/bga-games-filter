export default
{
    definition: {
        props: {
            name: {
                type: String,
                default: '',
            },
            useLink: {
                type: Boolean,
                default: false
            },
            isBlank: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            getName() {
                return this.name;
            },

            click() {
                if (this.useLink) {
                    window.open(`https://boardgamearena.com/gamepanel?game=${this.name}`, '_blank');
                    return
                }

                this.$emit('click')
            },

            getBackground() {
                if (this.isBlank) {
                    return ''
                }

                return `bg-[url('https://x.boardgamearena.net/data/gamemedia/${this.name}/banner/default_500.jpg?h=1651658186')]`;
            }
        },
    },
}