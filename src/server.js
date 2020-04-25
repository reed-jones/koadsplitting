import Koa from "koa"
import serve from "koa-static"
import read from "./shared/cache-read.js"
import bundle from "./shared/bundle.js"
import { join, resolve } from "path"
import { createReadStream, mkdirSync, existsSync } from "fs"
import data from "./shared/data.js"

// dist folder is a must
const distFolder = join(resolve(), ".bundled")
if (!existsSync(distFolder)) {
  mkdirSync(distFolder)
}

const app = new Koa()

// Serve all assets out of the public folder, easy
app.use(serve("./public"))

app.use(async ctx => {
  const name = ctx.url

  // If it exists on disk, or in the cache, proceed
  if (
    existsSync(join(resolve(), "src", "client", ctx.url)) ||
    data.has({ key: ctx.url })
  ) {
    // get the file from cache if available, or else bundle it
    const file = (await read({ name })) ?? (await bundle({ name }))

    // return to the bundled file
    ctx.type = "js"
    ctx.body = createReadStream(join("./.bundled", file))
  }
})

app.listen(3000)
console.log(`listening on http://localhost:3000`)
