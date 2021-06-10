import qs from 'querystring'
import axios from 'axios'
import type Discord from 'discord.js'
import type http from 'http'
module.exports = {
  pathname: '/api/gettoken',
  method: 'POST',
  run: async (client:Discord.Client, _db:any, req:http.IncomingMessage, res:http.ServerResponse) => {
    let post:string | any = ''
    req.on('data', data => {
      post += data
    })
    req.on('end', () => {
      if (post) {
        axios.post('https://discord.com/api/oauth2/token', qs.stringify({
          client_id: client.user!.id,
          client_secret: process.env.CLIENT_SECRET,
          code: post,
          scope: 'identify guilds',
          redirect_uri: 'https://verifier.teamint.xyz/static/html/new.html',
          grant_type: 'authorization_code'
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(r => {
          res.writeHead(200, {
            'Content-Type': "application/json"
          })
          res.end(JSON.stringify({
            access: r.data.access_token,
            refresh: r.data.refresh_token
          }))
        })
      } else {
        res.writeHead(401)
        res.end('No code')
      }
    })
  }
}