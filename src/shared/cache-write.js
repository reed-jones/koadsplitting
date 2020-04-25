import crypto from "crypto"
import path from "path"
import fs from "fs"
import data from "./data.js"

const generateFingerprint = (name, source) => {
  let hash = crypto.createHash("sha1")
  hash.update(Buffer.from(source))
  let sha = hash.digest("hex").substr(0, 7)
  let [filename, extension] = name
    .split("/")
    .slice(0)
    .reverse()
    .shift()
    .split(".")

  return `${filename}-${sha}.${extension}`
}

export default async function write({ name, source, cacheKey }) {
  // If the cache key was supplied, then don't bother with fingerprinting
  console.time(`fingerprint-${name}`)
  let fingerprint = cacheKey ?? generateFingerprint(name, source)
  console.timeEnd(`fingerprint-${name}`)

  // write file to disk. could write to s3 or something instead...
  console.time(`write-${name}`)
  let pathToPublic = "./" + path.join(".bundled", fingerprint)
  fs.writeFileSync(pathToPublic, source)
  console.timeEnd(`write-${name}`)

  // Save to cache manifest
  console.time(`cache-${name}`)
  data.set({ key: cacheKey ?? name, file: fingerprint })
  console.timeEnd(`cache-${name}`)

  return fingerprint
}
