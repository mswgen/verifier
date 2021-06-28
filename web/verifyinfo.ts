import type Discord from 'discord.js'
import type http from 'http'
import type url from 'url'
import type mongodb from 'mongodb'

export default {
  pathname: '/api/verifyinfo',
  method: 'POST',
  run: async (client: Discord.Client, db: { serverConf: mongodb.Collection, notifications: mongodb.Collection }, req: http.IncomingMessage, res: http.ServerResponse, parsed: url.UrlWithParsedQuery) => {
    let post = ''
    req.on('data', d => {
      post += d
    })
    req.on('end', async () => {
      if (!post || !(client as any).verifyQueue.get(post)) {
        res.writeHead(400)
        res.end(JSON.stringify({ status: 1 }))
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
        })
        res.end(JSON.stringify({
          guild: {
            name: (client as any).verifyQueue.get(post).guild.name.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'),
            id: (client as any).verifyQueue.get(post).guild.id
          },
          user: {
            name: (client as any).verifyQueue.get(post).user.tag.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'),
            id: (client as any).verifyQueue.get(post).user.id
          },
          text: ((await db.serverConf.findOne({ _id: (client as any).verifyQueue.get(post).guild.id })).msg || '{서버.이름} 규칙에 동의하신다면 아래 reCAPTCHA를 풀어주세요.')
            .replace(/{서버.이름}/gi, (client as any).verifyQueue.get(post).guild.name)
            .replace(/{유저.닉네임}/gi, (client as any).verifyQueue.get(post).user.username)
            .replace(/{유저.태그숫자}/gi, (client as any).verifyQueue.get(post).user.discriminator)
            .replace(/{유저.태그}/gi, (client as any).verifyQueue.get(post).user.tag)
            .replace(/</gi, '&lt;')
            .replace(/>/gi, '&gt;')
            .replace(/{줄바꿈}/gi, '<br>')
        }))
      }
    })
  }
}