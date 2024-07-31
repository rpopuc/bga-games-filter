export class Loader
{
    static files = [
        'IconUser',
        'IconUsers',
        'IconClock',
        'IconComplexity',
        'IconStar',
        'IconPlayed',
        'IconLearned',
        'IconFilter',
        'Rating',
        'RatingSelector',
        'Selector',
        'GameCard',
    ]

    static async load() {
        const path = import.meta.url.match(/.*\//)[0]
        return Promise.all(this.files.map(file => {
            return import(`${path}${file}/${file}.js`).then(module => {
                const component = module.default
                return fetch(`${path}${file}/${file}.html`).then(response => response.text()).then(template => {
                    Vue.component(file, {
                        template,
                        ...component.definition,
                    })
                })
            })
        }))
    }
}
