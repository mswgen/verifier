import Discord from 'discord.js'
import fs from 'fs'
import mongodb from 'mongodb'
require('dotenv').config()
const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
});
(client as any).paths = new Discord.Collection();
(client as any).verifyQueue = new Discord.Collection();
const MongoClient = new mongodb.MongoClient(`mongodb+srv://user:${process.env.DB_PASS}@cluster0.xoxgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
MongoClient.connect().then(() => {
  const db:{serverConf:mongodb.Collection, notifications:mongodb.Collection} = {
    serverConf: MongoClient.db('main').collection('serverConf'),
    notifications: MongoClient.db('main').collection('notifications')
  }
  function tokenGen(): string {
    let chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    let t: string[] | string | any = []
    for (let i = 0; i < 100; i++) {
      t.push(chars[Math.floor(Math.random() * chars.length)])
    }
    if ((client as any).verifyQueue.get(t)) t = tokenGen()
    return t?.join('')
  }
  const ascii = require('ascii-table')
  const table = new ascii().setHeading('Path', 'Load Status')
  fs.readdir('./dist/web/', (err: any, list: Array<string>) => {
    for (let file of list.filter(x => x.endsWith(('.js')))) {
      try {
        let pull = require(`./web/${file}`)
        if (pull.pathname && pull.run && pull.method) {
          table.addRow(file, '✅');
          (client as any).paths.set(pull.pathname, pull)
        } else {
          table.addRow(file, '❌ -> Error')
          continue
        }
      } catch (e) {
        table.addRow(file, `❌ -> ${e}`)
        continue
      }
    }
    console.log(table.toString())
  })
  client.on('ready', () => {
    console.log(`Login ${client.user!.username}`)
    setInterval(() => {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          client.user!.setPresence({
            status: 'online',
            activity: {
              name: `https://${process.env.DOMAIN}`,
              type: 'PLAYING'
            }
          })
          break
        case 1:
          client.user!.setPresence({
            status: 'online',
            activity: {
              name: `${client.guilds.cache.size}개의 서버`,
              type: 'PLAYING'
            }
          })
          break
        case 2:
          client.user!.setPresence({
            status: 'online',
            activity: {
              name: `${client.users.cache.size}명의 유저`,
              type: 'PLAYING'
            }
          })
          break
        case 3:
          client.user!.setPresence({
            status: 'online',
            activity: {
              name: 'verifier',
              type: 'STREAMING',
              url: `https://twitch.tv/${client.user!.username}`
            }
          })
          break
        case 4:
          client.user!.setPresence({
            status: 'online',
            activity: {
              name: '이 메세지는 5초마다 바뀝니다!',
              type: 'PLAYING'
            }
          })
          break
      }
    }, 5000)
    require('./web.js').start(client, db)
  })
  client.on('guildMemberAdd', async member => {
    if (member.partial) await member.fetch()
    let conf = await db.serverConf.findOne({_id: member.guild.id})
    if (!conf.unverifiedRole) return
    await member.roles.add(conf.unverifiedRole)
  })
  client.on('messageReactionAdd', async (r, u) => {
    if (r.partial) await r.fetch()
    if (r.message.partial) await r.message.fetch()
    let conf = await db.serverConf.findOne({_id: r.message.guild!.id})
    if (r.message.channel.id != conf.channelId || r.message.id != conf.messageId || u.bot) return
    await r.users.remove(u.id)
    if ((conf.verifiedRole && client.guilds.cache.get(r.message.guild!.id)!.member(u.id)!.roles.cache.has(conf.verifiedRole)) || (conf.unverifiedRole && !client.guilds.cache.get(r.message.guild!.id)!.member(u.id)!.roles.cache.has(conf.unverifiedRole))) return
    let tkn = tokenGen();
    (client as any).verifyQueue.set(tkn, {
      token: tkn,
      guild: r.message.guild,
      user: u
    })
    await u.send(`아래 링크를 통해 인증해주세요.\nhttps://${process.env.DOMAIN}/verify?token=${tkn}`)
  })
  client.on('guildCreate', async guild => {
    let conf = await db.serverConf.findOne({_id: guild.id})
    if (conf) return
    await db.serverConf.insertOne({
      _id: guild.id,
      unverifiedRole: undefined,
      verifiedRole: undefined,
      channelId: undefined,
      messageId: undefined,
      msg: '{서버.이름} 규칙에 동의하신다면 아래 버튼을 눌러주세요.',
      verifiedMsg: '인증을 완료했어요!'
    })
  })
  client.on('guildDelete', async guild => {
    let conf = await db.serverConf.findOne({_id: guild.id})
    if (!conf) return
    await db.serverConf.deleteOne({_id: guild.id})
  })
  client.login(process.env.TOKEN)
})