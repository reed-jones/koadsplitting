import crypto from "crypto"
import { join, resolve } from "path"
import fs from "fs"
import data from "./data.js"
import { put } from "./filesystem.js"

const generateFingerprint = (name, mode, source) => {
  let hash = crypto.createHash("sha1")
  hash.update(Buffer.from(source))
  let sha = hash.digest("hex").substr(0, 12)
  let [filename, extension] = name
    .split("/")
    .slice(0)
    .reverse()
    .shift()
    .split(".")

  return `${filename}-${mode}-${sha}.js`
}

export default async function write({ file, ssr, dom, name }) {
  // If the cache key was supplied, then don't bother with fingerprinting
  console.time(`fingerprint-${name}`)
  let SSRFingerprint = generateFingerprint(name, 'ssr', ssr)
  let DOMFingerprint = generateFingerprint(name, 'dom', dom)
  console.timeEnd(`fingerprint-${name}`)

  // write file to disk. could write to s3 or something instead...
  console.time(`write-${name}`)
  fs.writeFileSync(join(resolve(), SSRFingerprint), ssr)

  const { default: renderer } = await import(
    join(resolve(), SSRFingerprint)
  )
  fs.unlinkSync(join(resolve(), SSRFingerprint))

  const out = renderer.render({})

  put(SSRFingerprint.replace('.js', '.json'), JSON.stringify(out))
  put(DOMFingerprint, dom)
  console.timeEnd(`write-${name}`)

  const cacheData = { key: file, ssr: SSRFingerprint.replace('.js', '.json'), dom: DOMFingerprint, file, name }
  // Save to cache manifest
  console.time(`cache-${name}`)
  data.set(cacheData)
  console.timeEnd(`cache-${name}`)

  return cacheData
}
