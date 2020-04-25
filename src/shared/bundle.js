import * as rollup from 'rollup'
import write from './cache-write.js'
import { basename, resolve, join } from 'path'

export default async function bundle({ name }) {

    console.time(`bundle-${name}`)

    let bundle = await rollup.rollup({
        input: join(resolve(), 'src', 'client', name)
    })

    let bundled = await bundle.generate({ format: 'esm' })
    // console.log(bundled.output)
    bundled.output.filter(o => '/' + o.fileName !== name).forEach(output => {
        write({ name: basename(output.facadeModuleId), source: output.code, cacheKey: '/' + output.fileName })
    })

    let source = bundled.output.find(o => '/' + o.fileName === name).code

  console.timeEnd(`bundle-${name}`)

  return write({ name, source, cacheKey: name })
}
