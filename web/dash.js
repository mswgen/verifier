const axios = require('axios');
const qs = require('querystring');
const fs = require('fs');
module.exports = {
    pathname: '/dash',
    method: 'GET',
    run: async (client, req, res, parsed) => {
        if (!parsed.query.code) {
            res.writeHead(302, {
                'Location': `https://discord.com/oauth2/authorize?client_id=${client.user.id}&redirect_uri=${process.env.REDIRECT}&response_type=code&scope=identify&20guilds`,
                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            });
            res.end();
        } else {
            axios.post('https://discord.com/api/oauth2/token', qs.stringify({
                client_id: client.user.id,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: parsed.query.code,
                scope: 'identify guilds',
                redirect_uri: process.env.REDIRECT
            }), {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }).then(tokenRes => {
                fs.readFile('./assets/html/dash.html', 'utf8', (err, data) => {
                    res.writeHead(200, {
                        'content-type': 'text/html; charset=UTF-8',
                        // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                    });
                    res.end(data.replace('{tkn}', `Bearer ${tokenRes.data.access_token}`).replace(/{domain}/gi, process.env.DOMAIN));
                })
            }).catch(console.log)
        }
    }
}