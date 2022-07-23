import axios from 'axios'
import Discord from 'discord.js'
import type http from 'http'
import type mongodb from 'mongodb'
import type ServerConf from '../types/ServerConf'

export default {
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
          if (!r.data.some((x:any) => x.id == post) || !new Discord.PermissionsBitField(BigInt(r.data.find((x:any) => x.id == post).permissions)).has(Discord.PermissionFlagsBits.ManageGuild) || !r.data.some((x:any) => client.guilds.cache.get(x.id)?.members.me?.permissions.has([Discord.PermissionFlagsBits.ManageGuild, Discord.PermissionFlagsBits.ManageRoles]))) {
            res.writeHead(403)
            res.end('You can\'t change settings of this guild.')
            return
          }
          const dbVal = await db.serverConf.findOne({server: post}) as ServerConf
          res.writeHead(200)
          res.end(JSON.stringify({
            channelid: dbVal.channelId,
            messageid: dbVal.messageId,
            unverified: dbVal.unverifiedRole,
            verified: dbVal.verifiedRole,
            msg: dbVal.msg,
            verifiedmsg: dbVal.verifiedMsg,
            availableChannels: client.guilds.cache.get(post)?.channels.cache.filter(x => x.type == Discord.ChannelType.GuildText && x.permissionsFor(client.user!)!.has([Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.AddReactions, Discord.PermissionFlagsBits.ManageMessages, Discord.PermissionFlagsBits.ReadMessageHistory])).map(x => {
              return {name: x.name, id: x.id}
            }),
            availableRoles: client.guilds.cache.get(post)?.roles.cache.filter(x =>  x.position < x.guild.members.me!.roles.highest.position && x.id != post && !x.managed).map(x => {
              return {
                id: x.id,
                name: x.name
              }
            })
          }))
        })
      } else {
        res.writeHead(401)
        res.end('No token')
      }
    })
  }
}
