console.log('Booting verifier...');
process.stdout.write('[1/6] Importing modules...');
import Discord from 'discord.js'
import * as fs from 'fs'
import * as path from 'path'
import * as mongodb from 'mongodb'
import dotenv from 'dotenv'
import axios from 'axios'
process.stdout.write('\r\x1b[32m[1/6] All modules imported!\x1b[0m\n');
process.stdout.write('[2/6] Setting up env and initializing clients...');
if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'development') process.env.NODE_ENV = 'production'
dotenv.config({ path: path.resolve(process.cwd(), `${process.env.NODE_ENV}.env`) })
const client = new Discord.Client({
  partials: [Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.GuildMember, Discord.Partials.User, Discord.Partials.Channel],
  intents: [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildMessages,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.MessageContent
  ],
  ws: {
    properties: {
      browser: 'Discord Android'
    }
  }
})
async function addGuildToDB(db: mongodb.Collection, guildID: string): Promise<void> {
  await db.insertOne({
    server: guildID,
    unverifiedRole: undefined,
    verifiedRole: undefined,
    channelId: undefined,
    messageId: undefined,
    msg: '{서버.이름} 규칙에 동의하신다면 아래 버튼을 눌러주세요.',
    verifiedMsg: null
  })
}
(client as any).paths = new Discord.Collection();
(client as any).verifyQueue = new Discord.Collection()
const MongoClient = new mongodb.MongoClient(`mongodb+srv://user:${process.env.DB_PASS}@cluster0.ubmqr8k.mongodb.net/?retryWrites=true&w=majority`)
process.stdout.write('\r\x1b[32m[2/6] Finished setting up env and initialized clients!\x1b[0m\n');
if (process.env.NODE_ENV == 'development') {
  process.stdout.write('\x1b[33mNODE_ENV is development. Using dev bot and dev DB.\x1b[0m\n');
}
process.stdout.write('[3/6] Connecting to database...');
MongoClient.connect().then(() => {
  process.stdout.write('\r\x1b[32m[3/6] Successfully connected to database!\x1b[0m\n');
  const db:{serverConf:mongodb.Collection, notifications:mongodb.Collection} = {
    serverConf: MongoClient.db(process.env.DB_NAME).collection('serverConf'),
    notifications: MongoClient.db(process.env.DB_NAME).collection('notifications')
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
  const list = fs.readdirSync('./dist/web/').filter(x => x.endsWith('.js'))
  let loadedCnt: number = 0;
  let actLoadedCnt: number = 0;
  process.stdout.write(`[4/6] Importing web handlers... [${'.'.repeat(list.length)}]`);
  for (let file of list) {
    try {
      loadedCnt++;
      let pull = require(`./web/${file}`).default
      if (pull.pathname && pull.run && pull.method) {
        if (Array.isArray(pull.pathname)) {
          pull.pathname.forEach((pathname:string) => {
            (client as any).paths.set(pathname, pull)
          })
        } else {
          (client as any).paths.set(pull.pathname, pull)
	}
	process.stdout.write(`\r[4/6] Importing web handlers... [${'#'.repeat(loadedCnt)}${'.'.repeat(list.length - loadedCnt)}]`);
	actLoadedCnt++;
      } else {
        process.stdout.write(`\r\x1b[K\x1b[33mFailed importing ${file}: Missing pathname, run, or method\x1b[0m\n`);
 	process.stdout.write(`[4/6] Importing web handlers... [${'#'.repeat(loadedCnt)}${'.'.repeat(list.length - loadedCnt)}]`);
	continue
      }
    } catch (e: any) {
      process.stdout.write(`\r\x1b[K----------------\n\x1b[33mFailed importing ${file}: ${e.stack}\x1b[0m\n----------------\n`);
      process.stdout.write(`\r[4/6] Importing web handlers... [${'#'.repeat(loadedCnt)}${'.'.repeat(list.length - loadedCnt)}]`);
      continue
    }
  }
  client.on('ready', async () => {
    process.stdout.write(`\r\x1b[K\x1b[32m[5/6] Successfully logined to \x1b[1m${client.user!.username}\x1b[0m\x1b[32m!\x1b[0m\n`)
    setInterval(() => {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          client.user!.setPresence({
            status: 'online',
            activities: [{
              name: `https://${process.env.DOMAIN}`,
              type: Discord.ActivityType.Playing
            }]
          })
          break
        case 1:
          client.user!.setPresence({
            status: 'online',
            activities: [{
              name: `${client.guilds.cache.size}개의 서버`,
              type: Discord.ActivityType.Playing
            }]
          })
          break
        case 2:
          client.user!.setPresence({
            status: 'online',
            activities: [{
              name: `${client.users.cache.size}명의 유저`,
              type: Discord.ActivityType.Playing
            }]
          })
          break
        case 3:
          client.user!.setPresence({
            status: 'online',
            activities: [{
              name: 'verifier',
              type: Discord.ActivityType.Streaming,
              url: `https://twitch.tv/${client.user!.username}`
            }]
          })
          break
        case 4:
          client.user!.setPresence({
            status: 'online',
            activities: [{
              name: '이 메세지는 5초마다 바뀝니다!',
              type: Discord.ActivityType.Playing
            }]
          })
          break
      }
    }, 5000)
    process.stdout.write('[6/6] Starting webserver...');
    await require('./web.js').default.start(client, db)
    process.stdout.write(`\r\x1b[K\x1b[32m[6/6] Webserver started!\x1b[0m\n`);
    if (process.env.NODE_ENV == 'production') {
      setInterval(() => {
        axios.post(`https://koreanbots.dev/api/v2/bots/${client.user!.id}/stats`, JSON.stringify({
          servers: client.guilds.cache.size
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.KOREANBOTS!
          }
        }).then(() => {}).catch(() => {})
      }, 180000)
    }
  })
  client.on('guildMemberAdd', async member => {
    if (member.partial) await member.fetch()
    let conf = await db.serverConf.findOne({server: member.guild.id})
    if (!conf) {
      await addGuildToDB(db.serverConf, member.guild.id)
      return
    }
    if (!conf.unverifiedRole) return
    await member.roles.add(conf.unverifiedRole)
  })
  client.on('messageReactionAdd', async (r, u) => {
    if (r.partial) await r.fetch()
    if (r.message.partial) await r.message.fetch()
    if (u.partial) await u.fetch()
    let conf = await db.serverConf.findOne({server: r.message.guild!.id})
    if (!conf) {
      await addGuildToDB(db.serverConf, r.message.guild!.id)
      return
    }
    if (r.message.channel.id != conf!.channelId || r.message.id != conf!.messageId || u.bot) return
    await r.users.remove(u.id)
    if ((conf.verifiedRole && client.guilds.cache.get(r.message.guild!.id)!.members.cache.get(u.id)!.roles.cache.has(conf.verifiedRole)) || (conf.unverifiedRole && !client.guilds.cache.get(r.message.guild!.id)!.members.cache.get(u.id)!.roles.cache.has(conf.unverifiedRole))) return
    let tkn = tokenGen();
    (client as any).verifyQueue.set(tkn, {
      token: tkn,
      guild: r.message.guild,
      user: u
    })
    const embed = new Discord.EmbedBuilder()
      .setTitle(`${r.message.guild!.name} 인증`)
      .setDescription(`[여기를 클릭해 인증해주세요.](http${process.env.NODE_ENV == 'production' ? 's' : ''}://${process.env.DOMAIN}/verify?token=${tkn})\n인증 링크는 3분간 유효합니다.`)
      .setTimestamp()
      .setFooter({ text: u.tag!, iconURL: u.displayAvatarURL() })
      .setColor('Random')
    if (r.message.guild!.icon) embed.setThumbnail(r.message.guild!.iconURL()!)
    await u.send({ embeds: [embed] })
    setTimeout(() => {
      if ((client as any).verifyQueue.has(tkn)) {
      (client as any).verifyQueue.delete(tkn)
      }
    }, 180000)
  })
  client.on('guildCreate', async guild => {
    let conf = await db.serverConf.findOne({server: guild.id})
    if (!conf) await addGuildToDB(db.serverConf, guild.id)
  })
  client.on('guildDelete', async guild => {
    let conf = await db.serverConf.findOne({server: guild.id})
    if (!conf) return
    await db.serverConf.deleteOne({server: guild.id})
  })
  process.stdout.write(`\r\x1b[K\x1b[32m[4/6] Imported ${actLoadedCnt} web handlers(${loadedCnt - actLoadedCnt} fail)!\x1b[0m\n`);
  process.stdout.write('[5/6] Starting bot...');
  client.login(process.env.TOKEN)
})

client.on('messageCreate', async message => {
  if (message.channel.partial) await message.channel.fetch()
  if (message.content == '!hellothisisverification') {
    message.reply({ content: `${client.users.cache.get('647736678815105037')!.tag}(${client.users.cache.get('647736678815105037')!.id})` })
  }
})
