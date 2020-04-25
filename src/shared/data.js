/**
 * Basic cache implementation
 */
const cache = {}

export default {
  cache: () => cache,
  has: ({ key }) => !!cache[key],
  get: ({ key }) => cache[key],
  set: ({ key, file }) => ((cache[key] = { file, key }), cache),
}
