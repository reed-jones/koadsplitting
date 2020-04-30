/**
 * If using the CLI interface ( yarn svelte-server / npm run svelte-server )
 * then an optional setup.js file can be created in
 * the root directory to provide additional options
 */

export default {
    // data loading. pass props to files keyed by the url.
    // returns an object with each key being supplied to
    // 'props' in that file
    props: {
        '/': () => ({
            name: 'World'
        }),

        // wildcard routes will get converted to parameters
        // and passed into here for use with data-fetching
        // from an external api, or whatever
        '/posts/:post': async ({ post }) => {
            // do stuff with (or without) 'post' from the url
            return {
                slug: post
            }
        }
    },


    // settings for svelte-server. Most options have a CLI flag which can be used if preferred
    config: {
        // path to public assets
        public: './public',

        // pages for filesystem based routing
        pages: './pages',

        // non-page files
        // components: './components',

        // chokidar watch locations (just looks for svelte files)
        watch: ['./pages', './components'],

        // main page template: https://ejs.co/
        template: 'index.template.ejs',

        // dev mode
        // dev: process.env.NODE_ENV !== 'production',

        // show logging in console
        logging: process.env.NODE_ENV !== 'production',

        // hot module reloads (basically...)
        hmr: process.env.HMR_ENABLED,

        // use in-memory filesystem where possible
        // memfs: true,

        // periodically delete files after bundling
        // cleaning: true,

        // import aliases (not yet enabled)
        // aliases: {
        //     '@': './components'
        // }
    }
}
