import qs from 'querystring'
import axios from 'axios'
import fs from 'fs'
import type Discord from 'discord.js'
import type http from 'http'
module.exports = {
  pathname: '/subm',
  method: 'POST',
  run: async (client:Discord.Client, req:http.IncomingMessage, res:http.ServerResponse) => {
    let post:string | any = ''
    req.on('data', data => {
      post += data
    })
    req.on('end', () => {
      if (req.headers['content-type'] == 'application/json') {
        post = JSON.parse(post)
      } else if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
        post = qs.parse(post)
      }
      if (!post.token || !(client as any).verifyQueue.get(post.token)) {
        res.writeHead(400)
        res.end('Invalid token')
      } else {
        axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${post['g-recaptcha-response']}`).then(recaptchaRes => {
          if (recaptchaRes.data.success != true) {
            console.log(recaptchaRes.data)
            res.writeHead(400)
            res.end('reCAPTCHA authentication failed')
          } else {
            (client as any).verifyQueue.get(post.token).user.send('인증을 완료했어요!')
            let conf = require('/home/azureuser/verifier/data/config.json').guilds[(client as any).verifyQueue.get(post.token).guild.id]
            if (conf.unverifiedRole) client.guilds.cache.get((client as any).verifyQueue.get(post.token)!.guild.id)!.member((client as any).verifyQueue.get(post.token).user)!.roles.remove(conf.unverifiedRole)
            if (conf.verifiedRole) client.guilds.cache.get((client as any).verifyQueue.get(post.token).guild.id)!.member((client as any).verifyQueue.get(post.token).user)!.roles.add(conf.verifiedRole)
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=UTF-8',
              //'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            fs.readFile('./assets/html/done.html', 'utf8', (err, data) => {
              res.end(data
                .replace(/{guild_name}/gi, (client as any).verifyQueue.get(post.token).guild.name)
                .replace(/{domain}/gi, process.env.DOMAIN as any)
              );
              (client as any).verifyQueue.delete(post.token)
            })
          }
        })
      }
    })
  }
}