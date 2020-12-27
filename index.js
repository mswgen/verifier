const Discord = require('discord.js');
const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
});
client.paths = new Discord.Collection();
client.verifyQueue = new Discord.Collection();
function tokenGen () {
    let chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    let t = [];
    for (let i = 0; i < 500; i++) {
        t.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    if (client.verifyQueue.get(t)) t = tokenGen();
    return t.join('');
}
const ascii = require('ascii-table');
const table = new ascii().setHeading("Path", "Load Status");
const fs = require('fs');
require('dotenv').config();
fs.readdir('./web/', (err, list) => {
    for (let file of list) {
        try {
            let pull = require(`./web/${file}`);
            if (pull.pathname && pull.run && pull.method) {
                table.addRow(file, '✅');
                client.paths.set(pull.pathname, pull);
            } else {
                table.addRow(file, '❌ -> Error');
                continue;
            }
        } catch (e) { 
            table.addRow(file, `❌ -> ${e}`); 
            continue;
        }
    }
    console.log(table.toString());
});
client.on('ready', () => {
    console.log(`Login ${client.user.username}`);
    setInterval(() => {
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: `https://${process.env.DOMAIN}`,
                        type: "PLAYING"
                    }
                });
            case 1:
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: `${client.guilds.cache.size}개의 서버`,
                        type: "PLAYING"
                    }
                });
            case 2:
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: `${client.users.cache.size}명의 유저`,
                        type: "PLAYING"
                    }
                });
            case 3:
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: 'verifier',
                        type: "STREAMING",
                        url: `https://twitch.tv/${client.user.username}`
                    }
                });
            case 4:
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: `이 메세지는 5초마다 바뀝니다!`,
                        type: "PLAYING"
                    }
                });
        }
    }, 5000);
    require('./web.js').start(client);
});
client.on('guildMemberAdd', async member => {
    if (member.partial) await member.fetch();
    let conf = require(`/home/azureuser/data/config.json`);
    if (conf.guilds[member.guild.id]) {
        if (conf.guilds[member.guild.id].unverifiedRole) {
            member.roles.add(conf.guilds[member.guild.id].unverifiedRole);
        }
    }
});
client.on('messageReactionAdd', async (r, u) => {
    if (r.partial) await r.fetch();
    if (r.message.partial) await r.message.fetch();
    let conf = require('/home/azureuser/data/config.json').guilds[r.message.guild.id];
    if (r.message.channel.id == conf.channelId && r.message.id == conf.messageId && !u.bot) {
        r.users.remove(u.id);
        if ((conf.verifiedRole && client.guilds.cache.get(r.message.guild.id).member(u.id).roles.cache.has(conf.verifiedRole)) || (conf.unverifiedRole && !client.guilds.cache.get(r.message.guild.id).member(u.id).roles.cache.has(conf.unverifiedRole))) return;
        let tkn = tokenGen();
        client.verifyQueue.set(tkn, {
            token: tkn,
            guild: r.message.guild,
            user: u
        });
        u.send(`아래 링크를 통해 인증해주세요.\nhttps://${process.env.DOMAIN}/verify?token=${tkn}`);
    }
});
client.on('guildCreate', guild => {
    let conf = require('/home/azureuser/data/config.json');
    conf.guilds[guild.id] = {
        unverifiedRole: undefined,
        verifiedRole: undefined,
        channelId: undefined,
        messageId: undefined
    }
    fs.writeFileSync('/home/azureuser/data/config.json', JSON.stringify(conf));
});
client.on('guildDelete', guild => {
    let conf = require('/home/azureuser/data/config.json');
    if (conf.guilds[guild.id]) delete conf.guilds[guild.id];
    fs.writeFileSync('/home/azureuser/data/config.json', JSON.stringify(conf));
})
client.login(process.env.TOKEN);