import * as rollup from "rollup"
import write from "./cache-write.js"
import { basename, resolve, join } from "path"
import terser from "rollup-plugin-terser"
import livereload from "rollup-plugin-livereload"
// import svelte from "rollup-plugin-svelte"
import nodeResolve from "@rollup/plugin-node-resolve"
import { readFileSync } from "fs"
import svelte from "svelte/compiler.js"
import virtual from "@rollup/plugin-virtual"

const production = false

// https://stackoverflow.com/questions/17581830/load-node-js-module-from-string-in-memory
function requireFromString(src, filename) {
  console.log(m)
  var m = new Module()
  m._compile(src, filename)
  // return m.exports;
}

export default async function bundle({ route }) {
  console.time(`bundle-${route.file}`)
  console.log("setup rollup", join(resolve(), route.file))

  const name = `${route.file.replace("src/client/views", "")}.js`
  const raw = readFileSync(route.file).toString()
  const ssr = svelte.compile(raw, { generate: "ssr", hydratable: false, filename: name.replace('.svelte', '') })
  const dom = svelte.compile(raw, { generate: "dom", hydratable: true, filename: name.replace('.svelte', '') })

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
      ],
    }),
  ])

  const [ssrBundle, domBundle] = await Promise.all([
    ssrRollup.generate({ format: "esm" }),
    domRollup.generate({ format: "esm" }),
  ])

  // const bundle = await rollup.rollup({
  //   // rollup config
  //   input: route.file,
  //   plugins: [
  //     svelte({
  //       generate: 'ssr',
  //       // enable run-time checks when not in production
  //       dev: !production,
  //       // we'll extract any component CSS out into
  //       // a separate file - better for performance
  //       css: css => {
  //         css.write(`.bundled/${name.replace('.js', '.css')}`);
  //       }
  //     }),

  //     // If you have external dependencies installed from
  //     // npm, you'll most likely need these plugins. In
  //     // some cases you'll need additional configuration -
  //     // consult the documentation for details:
  //     // https://github.com/rollup/plugins/tree/master/packages/commonjs
  // nodeResolve({
  //   browser: true,
  //   dedupe: ['svelte']
  // }),

  //     production && terser.terser()
  //   ]
  //   // plugins: [terser.terser()],
  // })

  // const bundled = await bundle.generate({ format: "esm" })

  // Need to fingerprint & cache
  // console.log(ssrBundle)

  console.timeEnd(`bundle-${route.file}`)
  console.log(`REPLCEING: export default ${name.replace('.svelte.js', '').replace(/^\//, '')};` )
  // console.log(bundled.output[0].code)
  return write({ file: route.file, ssr: ssrBundle.output[0].code, dom: domBundle.output[0].code.replace(`export default ${name.replace('.svelte.js', '').replace(/^\//, '')};`, `new ${name.replace('.svelte.js', '').replace(/^\//, '')}({ target: document.body, hydrate: true })`), name })
}
