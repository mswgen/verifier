import axios from 'axios'
import Discord from 'discord.js'
import type http from 'http'

export default {
  pathname: '/api/getguilds',
  method: 'POST',
  run: async (client:Discord.Client, _db:any, req:http.IncomingMessage, res:http.ServerResponse) => {
    let post:string | any = ''
    req.on('data', data => {
      post += data
    })
    req.on('end', () => {
      if (post) {
        axios.get('https://discord.com/api/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${post}`
          }
        }).then(r => {
          res.writeHead(200, {
            'Content-Type': "application/json"
          })
          res.end(JSON.stringify(r.data.filter((x:any) => client.guilds.cache.get(x.id) && client.guilds.cache.get(x.id)!.members.me!.permissions.has([Discord.PermissionFlagsBits.ManageGuild, Discord.PermissionFlagsBits.ManageRoles]) && new Discord.PermissionsBitField(BigInt(x.permissions)).has(Discord.PermissionFlagsBits.ManageGuild)).map((x:{id:string, name:string, icon:string}) => {
            return {
              id: x.id,
              name: x.name.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'),
              icon: x.icon
            }
          })))
        })
      } else {
        res.writeHead(401)
        res.end('No code')
      }
    })
  }
}