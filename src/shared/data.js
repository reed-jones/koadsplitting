const cache = {}

export default {
    get: ({ key }) => {
        // console.log(`searching for cache ${key}`)
        // console.log(`found: ${cache[key]}`)
        return cache[key]
    },
    set: ({ key, file }) => {
        // console.log(`Setting cache ${key}`)
        // console.log({ cache, key, file })
        cache[key] = file
        // console.log("cache is now")
        // console.log(cache)
    }
}
