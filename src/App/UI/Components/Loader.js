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
        'Rating',
        'GameCard',
    ]

    static async load() {
        const path = import.meta.url.match(/.*\//)[0]
        return Promise.all(this.files.map(file => {
            return import(`${path}${file}/index.js`).then(module => {
                const component = module.default
                return fetch(`${path}/${file}/template.html`).then(response => response.text()).then(text => {
                    const template = text.match(/.*?script>(.*)/smi)[1]
                    Vue.component(file, {
                        template,
                        ...component.definition,
                    })
                })
            })
        }))
    }
}
