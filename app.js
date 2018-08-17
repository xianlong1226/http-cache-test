const Koa = require('koa');
const crypto = require('crypto');
const fs = require('fs');
const app = new Koa();

app.use(async ctx => {
  if (ctx.req.url === '/index') {
    // 设置CDN缓存300秒，浏览器缓存200秒
    ctx.set('Cache-Control', `public,s-maxage=300,max-age=200`)

    ctx.body = fs.readFileSync('index.html', 'utf8');
  } else if (ctx.req.url === '/second.html') {
    // 设置30分钟后过期
    let d = new Date()
    d.setMinutes(d.getMinutes() + 30)
    ctx.set('Expires', d.toGMTString())
    
    ctx.body = fs.readFileSync('second.html', 'utf8');
  } else if (ctx.req.url === '/index.js') {
    // 设置ETag
    if (ctx.get('if-none-match') === 'aaaaa') {
      ctx.response.status = 304
      return
    }
    ctx.set('ETag', 'aaaaa')

    ctx.body = fs.readFileSync('index.js', 'utf8');
  } else if (ctx.req.url === '/index.css') {
    // 设置最后修改时间
    if (ctx.get('if-modified-since') === 'Thu Jul 19 2018 18:43:32 GMT+0800 (CST)') {
      ctx.response.status = 304
      return
    }
    ctx.set('Last-Modified', 'Thu Jul 19 2018 18:43:32 GMT+0800 (CST)')

    ctx.body = fs.readFileSync('index.css', 'utf8');
  } else if (ctx.req.url === '/second.css') {
    // 设置不缓存
    ctx.set('Cache-Control', `no-cache,no-store`)

    ctx.body = fs.readFileSync('index.css', 'utf8');
  }
});

app.listen(3000);