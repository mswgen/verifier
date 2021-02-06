const fs = require('fs');
module.exports = {
    pathname: '/verify',
    method: 'GET',
    run: async (client, req, res, parsed, ops) => {
        if (!parsed.query || !parsed.query.token || !client.verifyQueue.get(parsed.query.token)) {
            res.writeHead(400);
            res.end('Invalid token');
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8',
                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            });
            fs.readFile('./assets/html/verify.html', 'utf8', (err, data) => {
                res.end(data
                    .replace(/{tag}/gi, client.verifyQueue.get(parsed.query.token).user.tag.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'))
                    .replace(/{user_profile}/gi, client.verifyQueue.get(parsed.query.token).user.displayAvatarURL())
                    .replace(/{guild_name}/gi, client.verifyQueue.get(parsed.query.token).guild.name.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'))
                    .replace(/{domain}/gi, process.env.DOMAIN)
                    .replace("{message}", require('/home/azureuser/verifier/data/config.json').guilds[client.verifyQueue.get(parsed.query.token).guild.id] ? (require('/home/azureuser/verifier/data/config.json').guilds[client.verifyQueue.get(parsed.query.token).guild.id].msg ? require('/home/azureuser/verifier/data/config.json').guilds[client.verifyQueue.get(parsed.query.token).guild.id].msg : '{서버.이름} 규칙에 동의하신다면 아래 reCAPTCHA를 풀어주세요.').replace(/{서버.이름}/gi, client.verifyQueue.get(parsed.query.token).guild.name).replace(/{유저.닉네임}/gi, client.verifyQueue.get(parsed.query.token).user.username).replace(/{유저.태그숫자}/gi, client.verifyQueue.get(parsed.query.token).user.discriminator).replace(/{유저.태그}/gi, client.verifyQueue.get(parsed.query.token).user.tag).replace(/</gi, "&lt;").replace(/>/gi, '&gt;').replace(/{줄바꿈}/gi, '<br>') : `${client.verifyQueue.get(parsed.query.token).guild.name} 규칙에 동의하신다면 아래 reCAPTCHA를 풀어주세요.`)
                );
            });
        }
    }
}