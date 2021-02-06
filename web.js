const https = require('https');
const http = require('http');
const axios = require('axios').default;
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const Discord = require('discord.js');
module.exports = {
    start: client => {
        /*
        const httpsServer = https.createServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/int-verifier.eastus.cloudapp.azure.com/fullchain.pem', 'utf8'),
            key: fs.readFileSync('/etc/letsencrypt/live/int-verifier.eastus.cloudapp.azure.com/privkey.pem', 'utf8')
        }, (req, res) => {
            let parsed = url.parse(req.url, true);
            if (parsed.pathname.startsWith('/static/')) {
                if (parsed.pathname.startsWith('/static/html/')) {
                    fs.readFile(`./assets/html/${path.parse(parsed.pathname).base}`, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(404, {
                                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                            });
                            res.end('404 Not Found');
                            return;
                        }
                        res.writeHead(200, {
                            'Content-Type': "text/html; charset=UTF-8",
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end(data);
                    });
                } else if (parsed.pathname.startsWith('/static/css/')) {
                    fs.readFile(`./assets/css/${path.parse(parsed.pathname).base}`, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(404, {
                                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                            });
                            res.end('404 Not Found');
                            return;
                        }
                        res.writeHead(200, {
                            'Content-Type': "text/css; charset=UTF-8",
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end(data);
                    });
                } else if (parsed.pathname.startsWith('/static/js/')) {
                    fs.readFile(`./assets/js/${path.parse(parsed.pathname).base}`, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(404, {
                                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                            });
                            res.end('404 Not Found');
                            return;
                        }
                        res.writeHead(200, {
                            'Content-Type': "text/javascript; charset=UTF-8",
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end(data);
                    });
                } else if (parsed.pathname.startsWith('/static/image/')) {
                    fs.readFile(`./assets/image/${path.parse(parsed.pathname).base}`, (err, data) => {
                        if (err) {
                            res.writeHead(404, {
                                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                            });
                            res.end('404 Not Found');
                            return;
                        }
                        res.writeHead(200, {
                            'Content-Type': "image/png",
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end(data);
                    });
                } else if (parsed.pathname.startsWith('/static/json/')) {
                    fs.readFile(`./assets/json/${path.parse(parsed.pathname).base}`, (err, data) => {
                        if (err) {
                            res.writeHead(404, {
                                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                            });
                            res.end('404 Not Found');
                            return;
                        }
                        res.writeHead(200, {
                            'Content-Type': "application/json; charset=UTF-8",
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end(data);
                    });
                } else {
                    res.writeHead(404, {
                        // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                    });
                    res.end('404 Not Found');
                }
            // } else if (parsed.pathname == '/manifest.json') {
            //     res.writeHead(200, {
            //         'content-type': 'application/json; charset=UTF-8',
            //         // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            //     });
            //     fs.readFile('./assets/json/manifest.json', 'utf8', (err, data) => {
            //         res.end(data);
            //     });
            // } else if (parsed.pathname == '/serviceWorker.js') {
            //     res.writeHead(200, {
            //         'content-type': 'text/javascript; charset=UTF-8',
            //         // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            //     });
            //     fs.readFile('./assets/js/serviceWorker.js', 'utf8', (err, data) => {
            //         res.end(data);
            //     });
            } else if (parsed.pathname.startsWith('/.well-known/acme-challenge/')) {
                fs.readFile(`./.well-known/acme-challenge/${path.parse(parsed.pathname).base}`, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(404, {
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end('404 Not Found');
                        return;
                    }
                    res.writeHead(200);
                    res.end(data);
                });
            } else {
                if (req.headers['user-agent'] && (req.headers['user-agent'].includes('MSIE') || req.headers['user-agent'].includes('rv:11.0'))) {
                    res.writeHead(200, {
                        'Content-Type': "text/html; charset=UTF-8",
                        // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                    });
                    fs.readFile('./assets/html/ie.html', 'utf8', (err, data) => {
                        res.end(data);
                    });
                    return;
                }
                if (client.paths.get(parsed.pathname)) {
                    if (client.paths.get(parsed.pathname).method == req.method) {
                        client.paths.get(parsed.pathname).run(client, req, res, parsed);
                    } else {
                        res.writeHead(405, {
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end('405 Method Not Allowed')
                    }
                } else {
                    res.writeHead(404, {
                        // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                    });
                    res.end('404 Not Found');
                }
            }
        });
        */
        const httpServer = http.createServer((req, res) => {
            if (parsed.pathname.startsWith('/.well-known/acme-challenge/')) {
                fs.readFile(`./.well-known/acme-challenge/${path.parse(parsed.pathname).base}`, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(404, {
                            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
                        });
                        res.end('404 Not Found');
                        return;
                    }
                    res.writeHead(200);
                    res.end(data);
                });
            } else {
                res.writeHead(302, {
                    'Location': `https://${process.env.DOMAIN}${req.url}`
                });
                res.end();
            }
        });
        // httpsServer.listen(4430);
        httpServer.listen(8000);
        // const io = require('socket.io')(httpsServer);
        io.on('connection', socket => {
            socket.on('init', token => {
                axios.get('https://discord.com/api/users/@me', {
                    headers: {
                        Authorization: token
                    }
                }).then(() => {
                    socket.token = token;
                    socket.emit('validated');
                }).catch(() => {
                    socket.disconnect();
                })
            });
            socket.on('servers', () => {
                let resp = [];
                axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        Authorization: socket.token
                    }
                }).then(res => {
                    for (let x of res.data) {
                        if ((new Discord.Permissions(x.permissions)).has(['MANAGE_GUILD']) && client.guilds.cache.get(x.id) && client.guilds.cache.get(x.id).me.hasPermission(['MANAGE_ROLES', 'VIEW_CHANNELS', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'])) {
                            resp.push({
                                id: x.id,
                                name: x.name.replace(/</gi, '&lt;').replace(/>/gi, '&gt;'),
                                icon: x.icon ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.webp` : `https://cdn.discordapp.com/embed/avatars/0.png`
                            });
                        }
                    }
                    socket.emit('servers-resp', resp);
                })
            });
            socket.on('getInfo', guildId => {
                axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        Authorization: socket.token
                    }
                }).then(x => {
                    if (new Discord.Permissions(x.data.find(a => a.id == guildId).permissions).has('MANAGE_GUILD')) {
                        socket.emit('info', require('/home/azureuser/verifier/data/config.json').guilds[guildId]);
                    }
                })
            });
            socket.on('subm', data => {
                axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        Authorization: socket.token
                    }
                }).then(res => {
                    if (new Discord.Permissions(res.data.find(a => a.id == data.guildId).permissions).has('MANAGE_GUILD')) {
                        if (!client.guilds.cache.get(data.guildId).channels.cache.find(x => x.id == data.channelId)) {
                            socket.emit('submitted', '입력한 채널을 찾을 수 없어요');
                            return;
                        }
                        if (client.guilds.cache.get(data.guildId).channels.cache.find(x => x.id == data.channelId).type != 'text' && client.guilds.cache.get(data.guildId).channels.cache.find(x => x.id == data.channelId).type != 'news') {
                            socket.emit('submitted', '채팅 채널, 공지 채널만 입력할 수 있어요');
                            return;
                        }
                        if (!client.guilds.cache.get(data.guildId).channels.cache.find(x => x.id == data.channelId).permissionsFor(client.user.id).has(['SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_MESSAGES'])) {
                            socket.emit('submitted', '봇이 입력한 채널에 대해서 메세지 보내기, 메세지 관리, 반응 추가하기 권한이 없어요');
                            return;
                        }
                        client.guilds.cache.get(data.guildId).channels.cache.find(x => x.id == data.channelId).messages.fetch(data.messageId).catch(() => {
                            socket.emit('submitted', '입력한 메세지를 찾을 수 없어요');
                        }).then(msg => {
                            if (data.unverifiedRole && !client.guilds.cache.get(data.guildId).roles.cache.get(data.unverifiedRole)) {
                                socket.emit('submitted', '입력한 미인증 역할을 찾을 수 없어요');
                                return;
                            }
                            if (data.unverifiedRole && client.guilds.cache.get(data.guildId).roles.cache.get(data.unverifiedRole).position >= client.guilds.cache.get(data.guildId).me.roles.highest.position) {
                                socket.emit('submitted', '봇이 입력한 미인증 역할을 지급할 수 없어요. 역할 순서를 변경해주세요.');
                                return;
                            }
                            if (data.verifiedRole && !client.guilds.cache.get(data.guildId).roles.cache.get(data.verifiedRole)) {
                                socket.emit('submitted', '입력한 인증 완료 역할을 찾을 수 없어요');
                                return;
                            }
                            if (data.verifiedRole && client.guilds.cache.get(data.guildId).roles.cache.get(data.verifiedRole).position >= client.guilds.cache.get(data.guildId).me.roles.highest.position) {
                                socket.emit('submitted', '봇이 입력한 인증 완료 역할을 지급할 수 없어요. 역할 순서를 변경해주세요.');
                                return;
                            }
                            if (!data.msg) {
                                socket.emit('submitted', '인증 페이지 내용을 입력해주세요.')
                            }
                            if (data.msg.length > 200) {
                                socket.emit('submitted', '인증 페이지 내용은 최대 200자까지 입력할 수 있어요.')
                            }
                            if (data.verifiedMsg && data.verifiedMsg.length > 2000) {
                                socket.emit('submitted', '인증 완료 메세지는 최대 2000자까지 입력할 수 있어요.')
                            }
                            let conf = require('/home/azureuser/verifier/data/config.json');
                            conf.guilds[data.guildId] = {
                                channelId: data.channelId,
                                messageId: data.messageId,
                                unverifiedRole: data.unverifiedRole,
                                verifiedRole: data.verifiedRole,
                                verifiedMsg: data.verifiedMsg,
                                msg: data.msg
                            }
                            msg.react('✅');
                            fs.writeFile('/home/azureuser/verifier/data/config.json', JSON.stringify(conf), () => {
                                socket.emit('submitted');
                            });
                        });
                    } else {
                        socket.emit('submitted', '이 서버의 설정은 바꿀 수 없어요');
                    }
                })
            })
        });    
    }
}