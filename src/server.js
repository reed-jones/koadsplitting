import Koa from "koa"
import serve from "koa-static"
import read from "./shared/cache-read.js"
import bundle from "./shared/bundle.js"
import { join, resolve } from "path"
import {
  createReadStream,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs"
import data from "./shared/data.js"
import ejs from "ejs"
import svelte from "svelte/compiler.js"

var walkSync = (dir, fileList = null) => {
  var files = readdirSync(dir)
  fileList = fileList ?? []
  files.forEach(file => {
    if (statSync(join(dir, file)).isDirectory()) {
      fileList = walkSync(join(dir, file, "/"), fileList)
    } else {
      fileList.push(join(dir, file))
    }
  })
  return fileList
}

const routes = walkSync("./src/client/views").map(file => {
  const lowercase = file.toLowerCase()
  const withoutRoot = lowercase.replace("src/client/views", "")
  const withoutExtension = withoutRoot.replace(".svelte", "")
  const withoutIndex = withoutExtension.replace(/\/index$/, "")
  const withPrefix = join("/", withoutIndex)

  return {
    url: withPrefix,
    file: file,
  }
})

// dist folder is a must
const distFolder = join(resolve(), ".bundled")
if (!existsSync(distFolder)) {
  mkdirSync(distFolder)
}

const app = new Koa()

// Serve all assets out of the public folder, easy
app.use(serve("./public"))

app.use(async (ctx, next) => {
  const route = routes.find(route => route.url === ctx.url)

  if (!route) {
    return next()
  }

  const file = (await read({ route })) ?? (await bundle({ route }))

  const { default: renderer } = await import(
    join("..", ".bundled", `${file.ssr}.js`)
  )

  const out = renderer.render({})

  const domPath = join("/", "js", `${file.dom}.js`)

  const html = ejs.render(readFileSync("./src/index.template.html", "utf-8"), {
    script: `<script src=${domPath} type=module></script>`,
    html: out.html,
    style: `<style>${out.css.code}</style>`,
    head: out.head,
  })

  ctx.type = "html"
  ctx.body = html
})

app.use(async (ctx, next) => {
  if (!ctx.url.startsWith("/js/")) {
    return next()
  }

  const name = ctx.url.replace("/js/", "") // remove 'module' flag
  ctx.type = "js"
  ctx.body = createReadStream(join("./.bundled", name))
})

app.listen(3000)
console.log(`listening on http://localhost:3000`)
