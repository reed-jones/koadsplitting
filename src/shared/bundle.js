import * as rollup from "rollup"
import write from "./cache-write.js"
import { basename, resolve, join } from "path"
import terser from "rollup-plugin-terser"

export default async function bundle({ name }) {
  console.time(`bundle-${name}`)
  const bundle = await rollup.rollup({
    // rollup config
    input: join(resolve(), "src", "client", name),
    plugins: [terser.terser()],
  })

  const bundled = await bundle.generate({ format: "esm" })
  console.timeEnd(`bundle-${name}`)

  // Anything not matching the requested fileName
  // must be a dynamic import, write these and add
  // to the cache manifest
  if (bundled.output.length > 1) {
    await Promise.all(
      bundled.output
        .filter(o => join("/", o.fileName) !== name)
        .map(output => {
          write({
            name: basename(output.facadeModuleId),
            source: output.code,
            cacheKey: join("/", output.fileName),
          })
        })
    )
  }

  const final = bundled.output.find(o => join("/", o.fileName) === name)
  return write({ name, source: final.code })
}
