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
import { get } from "./shared/filesystem.js"

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

const routes = walkSync("./pages").map(file => {
  const lowercase = file.toLowerCase()
  const withoutRoot = lowercase.replace("pages", "")
  const withoutExtension = withoutRoot.replace(".svelte", "")
  const withoutIndex = withoutExtension.replace(/\/index$/, "")
  const withPrefix = join("/", withoutIndex)

  return {
    url: withPrefix,
    file: file,
  }
})


const app = new Koa()

// Serve all assets out of the public folder, easy
app.use(serve("./public"))

app.use(async (ctx, next) => {
  const route = routes.find(route => route.url === ctx.url)

  if (!route) {
    return next()
  }

  let file = (await read({ route })) ?? (await bundle({ route }))

  const out = JSON.parse(get(file.ssr))

  const domPath = join("/", "js", `${file.dom}`)

  ctx.type = "html"
  ctx.body = ejs.render(readFileSync("./index.template.html", "utf-8"), {
    script: `<script src=${domPath} type=module></script>`,
    html: out.html,
    style: `<style>${out.css.code}</style>`,
    head: out.head,
  })
})

app.use(async (ctx, next) => {
  if (!ctx.url.startsWith("/js/")) {
    return next()
  }

  const name = ctx.url.replace("/js/", "") // remove 'module' flag
  ctx.type = "js"
  ctx.body = get(name)
})

app.listen(3000)
console.log(`listening on http://localhost:3000`)
