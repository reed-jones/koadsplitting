import { join, resolve } from 'path'
import { existsSync } from 'fs'
import data from './data.js'

export default async function read({ name }) {
  // check the cache manifest
  let cache = await data.get({ key: name })

  // look for the entry file in the path
  if (cache == false && existsSync(join(resolve(), 'dist', name)) == false)
      throw ReferenceError(`not_found: ${ name }`)

  return cache
    ? cache.file
    : false
}
