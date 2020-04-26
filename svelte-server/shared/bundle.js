import * as rollup from "rollup"
import write from "./cache-write.js"
import terser from "rollup-plugin-terser"
// import livereload from "rollup-plugin-livereload"
import nodeResolve from "@rollup/plugin-node-resolve"
import { readFileSync } from "fs"
import svelte from "svelte/compiler.js"
import virtual from "@rollup/plugin-virtual"
import chalk from "chalk"

export default async function bundle({ route }, options) {
  const stopTimer = options.logging.start(`[${chalk.yellow('Bundling')}]: ${route.relative}`)

  const name = `${route.relative}.js` // Index.svelte.js
  const raw = readFileSync(route.file).toString()
  const componentName = name
    .split(".") // split on extension
    .find(a => true) // get before extension
    .split("/") // split file paths
    .reverse() // put file name before path
    .find(a => true) // grab the first found

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

  // Trade an export default for a new component instance
  dom.js.code = dom.js.code.replace(
    `export default ${componentName};`,
    `new ${componentName}({ target: document.body, hydrate: true });`
  )

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
        options.production && terser.terser(),
      ],
    }),
  ])

  const [ssrModule, domModule, domNoModule] = await Promise.all([
    ssrRollup.generate({ format: "esm" }),
    domRollup.generate({ format: "esm" }), // module
    domRollup.generate({ format: "iife" }), // nomodule
  ])

  stopTimer()

  return write({
    file: route.file,
    ssr: ssrModule.output[0].code,
    dom: domModule.output[0].code,
    iife: domNoModule.output[0].code,
    name,
  }, options)
}
