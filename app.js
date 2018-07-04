const Koa = require('koa');
const crypto = require('crypto');
const fs = require('fs');
const app = new Koa();

app.use(async ctx => {
  if (ctx.req.url === '/index') {
    ctx.body = fs.readFileSync('index.html', 'utf8');

    // 由于浏览器点刷新按钮或地址栏回车都会强制发请求，所以index.html永远不会缓存
    ctx.set('Cache-Control', 'public,max-age=120');
    // ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
    // ctx.response.lastModified = new Date();
  } else if (ctx.req.url === '/second.html') {
    ctx.body = fs.readFileSync('second.html', 'utf8');

    ctx.set('Cache-Control', 'public,max-age=120');
    // ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
    ctx.response.lastModified = new Date();
  } else if (ctx.req.url === '/index.js') {
    ctx.body = fs.readFileSync('index.js', 'utf8');

    ctx.set('Cache-Control', 'public,max-age=120');
    // ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
    ctx.response.lastModified = new Date();
  } else if (ctx.req.url === '/index.css') {
    ctx.body = fs.readFileSync('index.css', 'utf8');
  }
});

app.listen(3000);