import crypto from "crypto";
import path from "path";
import fs from "fs";
import data from './data.js'

const generateFingerprint = (name, source) => {
  let hash = crypto.createHash("sha1");
  hash.update(Buffer.from(source));
  let sha = hash.digest("hex").substr(0, 7);
  let [filename, extension] = name
    .split("/")
    .slice(0)
    .reverse()
    .shift()
    .split(".");

  return `${filename}-${sha}.${extension}`;
}

export default async function write({ name, source, cacheKey }) {
  // fingerprint it
  console.time(`fingerprint-${name}`);

  let fingerprint = name !== cacheKey ? cacheKey : generateFingerprint(name, source)

  console.timeEnd(`fingerprint-${name}`);

  // write local when running local
  console.time(`write-${name}`);

  console.log(`writing =================== ${name === cacheKey}`)
  let pathToPublic = './' + path.join("dist", fingerprint);
  // console.warn("WRITING FILE")
  // console.warn(pathToPublic)
  fs.writeFileSync(pathToPublic, source);

  console.timeEnd(`write-${name}`);

  console.time(`ddb-cache-${name}`);
  let key = cacheKey;
  let file = fingerprint;
  await data.set({ key, file });
  console.timeEnd(`ddb-cache-${name}`);

  return fingerprint;
}
