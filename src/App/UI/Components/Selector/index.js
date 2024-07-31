export default
{
    definition: {
        data() {
            return {
                internalShowList: false,
                internalSelected: this.value,
            }
        },

        props: {
            options: {
                type: Array,
            },
            value: {
                type: Number,
                default: 1,
            }
        },
        methods: {
            toggleList() {
                this.internalShowList = !this.internalShowList;
            },

            select(option) {
                this.internalSelected = option.id;
                this.toggleList();
                this.$emit('input', this.internalSelected);
            }
        },
        watch: {
            value(newValue) {
                this.internalSelected = newValue;
            }
        },
        computed: {
            showList() {
                return this.internalShowList;
            },

            selected() {
                return this.internalSelected;
            },

            selectedOption() {
                return this.options.find(option => option.id === this.internalSelected);
            }
        }
    },
}
