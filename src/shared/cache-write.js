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

export default async function write({ file, ssr, dom, name }) {
  // If the cache key was supplied, then don't bother with fingerprinting
  console.time(`fingerprint-${name}`)
  let SSRFingerprint = generateFingerprint(name, ssr)
  let DOMFingerprint = generateFingerprint(name, dom)
  console.timeEnd(`fingerprint-${name}`)

  // write file to disk. could write to s3 or something instead...
  console.time(`write-${name}`)
  fs.writeFileSync(path.join(".bundled", `${SSRFingerprint}.js`), ssr)
  fs.writeFileSync(path.join(".bundled", `${DOMFingerprint}.js`), dom)
  console.timeEnd(`write-${name}`)

  const cacheData = { key: file, ssr: SSRFingerprint, dom: DOMFingerprint, file, name }
  // Save to cache manifest
  console.time(`cache-${name}`)
  data.set(cacheData)
  console.timeEnd(`cache-${name}`)

  return cacheData
}
