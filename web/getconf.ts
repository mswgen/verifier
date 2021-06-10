import axios from 'axios'
import Discord from 'discord.js'
import type http from 'http'
import type mongodb from 'mongodb'
module.exports = {
  pathname: '/api/getconf',
  method: 'POST',
  run: async (client:Discord.Client, db:{serverConf: mongodb.Collection, notifications: mongodb.Collection}, req:http.IncomingMessage, res:http.ServerResponse) => {
    let post:string | any = ''
    req.on('data', data => {
      post += data
    })
    req.on('end', () => {
      if (req.headers.authorization) {
        axios.get('https://discord.com/api/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${req.headers.authorization}`
          }
        }).then(async r => {
          if (!r.data.some((x:any) => x.id == post) || !new Discord.Permissions(r.data.find((x:any) => x.id == post).permissions).has('MANAGE_GUILD') || !r.data.some((x:any) => client.guilds.cache.get(x.id)?.me?.hasPermission(['MANAGE_GUILD', 'MANAGE_ROLES']))) {
            res.writeHead(403)
            res.end('You can\'t change settings of this guild.')
            return
          }
          const dbVal = await db.serverConf.findOne({_id: post})
          res.writeHead(200)
          res.end(JSON.stringify({
            channelid: dbVal.channelId,
            messageid: dbVal.messageId,
            unverified: dbVal.unverifiedRole,
            verified: dbVal.verifiedRole,
            msg: dbVal.msg,
            verifiedmsg: dbVal.verifiedMsg
          }))
        })
      } else {
        res.writeHead(401)
        res.end('No token')
      }
    })
  }
}