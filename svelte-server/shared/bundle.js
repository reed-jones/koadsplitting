import * as rollup from "rollup"
import write from "./cache-write.js"
import { basename, resolve, join } from "path"
import terser from "rollup-plugin-terser"
// import livereload from "rollup-plugin-livereload"
// import svelte from "rollup-plugin-svelte"
import nodeResolve from "@rollup/plugin-node-resolve"
import { readFileSync } from "fs"
import svelte from "svelte/compiler.js"
import virtual from "@rollup/plugin-virtual"

const production = false

export default async function bundle({ route }) {
  console.time(`bundle-${route.file}`)
  console.log("setup rollup", join(resolve(), route.file))

  const name = `${route.file.replace("pages", "")}.js` // Index.svelte.js
  const raw = readFileSync(route.file).toString()
  const componentName = name.split('.').find(a => true).split('/').reverse().find(a => true)
  const ssr = svelte.compile(raw, {
    generate: "ssr",
    css: true,
    hydratable: false,
    name: componentName,
    filename: componentName,
  })
  const dom = svelte.compile(raw, {
    generate: "dom",
    css: false,
    hydratable: true,
    name: componentName,
    filename: componentName,
  })
  dom.js.code = dom.js.code.replace(`export default ${componentName};`, `new ${componentName}({ target: document.body, hydrate: true });`)
  const [ssrRollup, domRollup] = await Promise.all([
    rollup.rollup({
      input: "ssr",
      plugins: [
        virtual({ ssr: ssr.js.code }),
        nodeResolve({
          browser: true,
          dedupe: ["svelte"],
        }),
      ],
    }),
    rollup.rollup({
      input: "dom",
      plugins: [
        virtual({ dom: dom.js.code }),
        nodeResolve({
          browser: true,
          dedupe: ["svelte"],
        }),
        terser.terser()
      ],
    }),
  ])

  const [ssrBundle, domBundle] = await Promise.all([
    ssrRollup.generate({ format: "esm" }),
    domRollup.generate({ format: "esm" }),
  ])

  console.timeEnd(`bundle-${route.file}`)

  return write({
    file: route.file,
    ssr: ssrBundle.output[0].code,
    // Would like to have a better way of doing this...
    dom: domBundle.output[0].code,
    name,
  })
}
