import { join, resolve } from "path"
import { existsSync } from "fs"
import data from "./data.js"

export default async function read({ name }) {
  // check the cache manifest
  const cache = data.get({ key: name })

  // look for the entry file in the path
  if (!cache && !existsSync(join(resolve(), "src", "client", name))) {
    throw ReferenceError(`not_found: ${name}`)
  }

  return cache ? cache.file : null
}
