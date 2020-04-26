/**
 * Basic cache implementation
 */
let cache = {}

export default {
  cache: () => cache,
  has: ({ key }) => !!cache[key],
    get: ({ key }) => {
        console.log("Looking for " + key)
        return cache[key]
    },
  set: ({ key, ...rest }) => ((cache[key] = { key, ...rest }), cache),
  clear: () => ((cache = {}), cache),
}
