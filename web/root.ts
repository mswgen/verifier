import fs from 'fs/promises'
import type Discord from 'discord.js'
import type http from 'http'

export default {
  pathname: ['/', '/guildselect', '/dash', '/verify', '/verified'],
  method: 'GET',
  run: async (client: Discord.Client, _db: any, req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Link', [
      '</static/css/compiled.css>; rel=preload; as=style',
      '</static/js/spa.js>; rel=preload; as=script',
      '</static/image/svg/light.svg>; rel=preload; as=image',
      '</static/image/svg/mountain.svg>; rel=preload; as=image',
      '</static/image/webp/inticon.webp>; rel=preload; as=image'
    ])
    res.writeHead(200, {
      // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload',
      'content-type': 'text/html; charset=UTF-8'
    })
    fs.readFile('./assets/html/index.html', 'utf8').then(data => {
      res.end(data)
    })
  }
}