import fs from 'fs'
import type Discord from 'discord.js'
import type http from 'http'
import type url from 'url'
import type mongodb from 'mongodb'

export default {
  pathname: '/verify',
  method: 'GET',
  run: async (client:Discord.Client, db:{serverConf: mongodb.Collection, notifications: mongodb.Collection}, req:http.IncomingMessage, res:http.ServerResponse, parsed:url.UrlWithParsedQuery) => {
    if (!parsed.query || !parsed.query.token || !(client as any).verifyQueue.get(parsed.query.token)) {
      res.writeHead(400)
      res.end('Invalid token')
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
      })
      fs.readFile('./assets/html/verify.html', 'utf8', async (err:any, data:string) => {
        res.end(data
          .replace(/{tag}/gi, (client as any).verifyQueue.get(parsed.query.token).user.tag.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'))
          .replace(/{user_profile}/gi, (client as any).verifyQueue.get(parsed.query.token).user.displayAvatarURL())
          .replace(/{guild_name}/gi, (client as any).verifyQueue.get(parsed.query.token).guild.name.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'))
          .replace(/{domain}/gi, process.env.DOMAIN as string)
          .replace('{message}', ((await db.serverConf.findOne({_id: (client as any).verifyQueue.get(parsed.query.token).guild.id})).msg || '{서버.이름} 규칙에 동의하신다면 아래 reCAPTCHA를 풀어주세요.')
            .replace(/{서버.이름}/gi, (client as any).verifyQueue.get(parsed.query.token).guild.name)
            .replace(/{유저.닉네임}/gi, (client as any).verifyQueue.get(parsed.query.token).user.username)
            .replace(/{유저.태그숫자}/gi, (client as any).verifyQueue.get(parsed.query.token).user.discriminator)
            .replace(/{유저.태그}/gi, (client as any).verifyQueue.get(parsed.query.token).user.tag)
            .replace(/</gi, '&lt;')
            .replace(/>/gi, '&gt;')
            .replace(/{줄바꿈}/gi, '<br>'))
        )
      })
    }
  }
}