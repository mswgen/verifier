import fs from 'fs'
import type Discord from 'discord.js'
import type http from 'http'
module.exports = {
  pathname: '/',
  method: 'GET',
  run: async (client:Discord.Client, req:http.IncomingMessage, res:http.ServerResponse) => {
    res.writeHead(200, {
      // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload',
      'content-type': 'text/html; charset=UTF-8'
    })
    fs.readFile('./assets/html/root.html', 'utf8', (err, data) => {
      res.end(data.replace(/{redirect}/gi, process.env.REDIRECT as string).replace(/{client_id}/gi, client.user!.id))
    })
  }
}