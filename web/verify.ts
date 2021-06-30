import axios from 'axios'
import type Discord from 'discord.js'
import type http from 'http'
import type mongodb from 'mongodb'

export default {
    pathname: '/api/verify',
    method: 'POST',
    run: async (client: Discord.Client, db: { serverConf: mongodb.Collection, notifications: mongodb.Collection }, req: http.IncomingMessage, res: http.ServerResponse) => {
        if (!req.headers.token || !(client as any).verifyQueue.get(req.headers.token)) {
            res.writeHead(400)
            res.end('Invalid token')
        } else {
            axios.get(`https://hcaptcha.com/siteverify?secret=${process.env.HCAPTCHA}&response=${req.headers.hcaptcha}&remoteip=${req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']}&sitekey=87b3c11a-f500-4c15-9fb2-1de943d2ac93`).then(async hcaptchaRes => {
                if (hcaptchaRes.data.success != true) {
                    console.log(hcaptchaRes.data)
                    res.writeHead(400)
                    res.end('hCaptcha authentication failed')
                } else {
                    let conf = await db.serverConf.findOne({ _id: (client as any).verifyQueue.get(req.headers.token).guild.id })
                    if (conf.verifiedMsg) {
                        (client as any).verifyQueue.get(req.headers.token).user.send(conf.verifiedMsg)
                    }
                    if (conf.unverifiedRole) await client.guilds.cache.get((client as any).verifyQueue.get(req.headers.token)!.guild.id)!.member((client as any).verifyQueue.get(req.headers.token).user)!.roles.remove(conf.unverifiedRole)
                    if (conf.verifiedRole) await client.guilds.cache.get((client as any).verifyQueue.get(req.headers.token).guild.id)!.member((client as any).verifyQueue.get(req.headers.token).user)!.roles.add(conf.verifiedRole)
                    res.writeHead(200, {
                        'Content-Type': 'text/plain; charset=UTF-8',
                        //'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                    })
                    res.end('ok');
                    (client as any).verifyQueue.delete(req.headers.token)
                }
            })
        }
    }
}