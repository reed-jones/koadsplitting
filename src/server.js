import Koa from "koa";
import serve from "koa-static";
import read from './shared/cache-read.js'
import bundle from './shared/bundle.js'
import { join, resolve } from 'path'
import { createReadStream, mkdirSync, existsSync } from "fs";

// dist folder is a must
const distFolder = join(resolve(), 'dist')
if (!existsSync(distFolder)) {
    mkdirSync(distFolder)
}

const app = new Koa();

// Serve all assets out of the public folder, easy
app.use(serve("./public"));

app.use(async ctx => {
    if (ctx.url.startsWith('/_static')) {
        ctx.type = 'js'
        ctx.body = createReadStream(ctx.url.replace('/_static', './dist'))
    } else {
        const name = ctx.url
        // check to see if file is in cache
        let file = await read({ name });
        // if the file is not found bundle it
        if (!file) {
            file = await bundle({ name });
        }
        // redirect to the file
        ctx.redirect(`/_static/${file}`);
        // ctx.status = 200
        // ctx.body = ctx.url
    }
});

app.listen(3000);
console.log(`listening on http://localhost:3000`);
