import fs from 'fs'
import type Discord from 'discord.js'
import type http from 'http'

export default {
  pathname: '/',
  method: 'GET',
  run: async (client: Discord.Client, _db: any, req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, {
      // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload',
      'content-type': 'text/html; charset=UTF-8'
    })
    fs.readFile('./assets/html/index.html', 'utf8', (err, data) => {
      res.end(data)
    })
  }
}