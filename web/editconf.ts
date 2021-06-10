import axios from 'axios'
import Discord from 'discord.js'
import type http from 'http'
import type mongodb from 'mongodb'
module.exports = {
    pathname: '/api/editconf',
    method: 'POST',
    run: async (client: Discord.Client, db: { serverConf: mongodb.Collection, notifications: mongodb.Collection }, req: http.IncomingMessage, res: http.ServerResponse) => {
        let post: string | any = ''
        req.on('data', data => {
            post += data
        })
        req.on('end', () => {
            post = JSON.parse(post)
            if (req.headers.authorization) {
                axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        Authorization: `Bearer ${req.headers.authorization}`
                    }
                }).then(async r => {
                    if (!r.data.some((x: any) => x.id == post.guildid) || !new Discord.Permissions(r.data.find((x: any) => x.id == post.guildid).permissions).has('MANAGE_GUILD') || !r.data.some((x: any) => client.guilds.cache.get(x.id)?.me?.hasPermission(['MANAGE_GUILD', 'MANAGE_ROLES']))) {
                        res.writeHead(403)
                        res.end('error')
                        return
                    }
                    if (post.channelid && !client.guilds.cache.get(post.guildid)!.channels.cache.find(x => x.id == post.channelid)) {
                        res.writeHead(200)
                        res.end('입력한 채널을 찾을 수 없어요')
                        return
                    }
                    if (post.channelid && client.guilds.cache.get(post.guildid)!.channels.cache.find(x => x.id == post.channelid)!.type != 'text' && client.guilds.cache.get(post.guildid)!.channels.cache.find(x => x.id == post.channelid)!.type != 'news') {
                        res.writeHead(200)
                        res.end('채팅 채널, 공지 채널만 입력할 수 있어요')
                        return
                    }
                    if (post.channelid && !client.guilds.cache.get(post.guildid)!.channels.cache.find(x => x.id == post.channelid)!.permissionsFor(client.user!.id)!.has(['SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_MESSAGES'])) {
                        res.writeHead(200)
                        res.end('봇이 입력한 채널에 대해서 메세지 보내기, 메세지 관리, 반응 추가하기 권한이 없어요')
                        return
                    }
                    if (post.messageid) {
                        try {
                            let msg = await (client.guilds.cache.get(post.guildid)!.channels.cache.find(x => x.id == post.channelid) as Discord.TextChannel).messages.fetch(post.messageid)
                            msg?.react('✅')
                        } catch (e) {
                            res.writeHead(200)
                            res.end('입력한 메세지를 찾을 수 없어요')
                            return
                        }
                    }
                    if (post.unverified && post.unverified != 'none' && !client.guilds.cache.get(post.guildid)!.roles.cache.get(post.unverified)) {
                        res.writeHead(200)
                        res.end('입력한 미인증 역할을 찾을 수 없어요')
                        return
                    }

                    if (post.unverified && post.unverified != 'none' && client.guilds.cache.get(post.guildid)!.roles.cache.get(post.unverified)!.position >= client.guilds.cache.get(post.guildid)!.me!.roles.highest.position) {
                        res.writeHead(200)
                        res.end('봇이 입력한 미인증 역할을 지급할 수 없어요. 역할 순서를 변경해주세요.')
                        return
                    }
                    if (post.verified && post.verified != 'none' && !client.guilds.cache.get(post.guildid)!.roles.cache.get(post.verified)) {
                        res.writeHead(200)
                        res.end('입력한 인증 완료 역할을 찾을 수 없어요')
                        return
                    }
                    if (post.verified && post.verified != 'none' && client.guilds.cache.get(post.guildid)!.roles.cache.get(post.verified)!.position >= client.guilds.cache.get(post.guildid)!.me!.roles.highest.position) {
                        res.writeHead(200)
                        res.end('봇이 입력한 인증 완료 역할을 지급할 수 없어요. 역할 순서를 변경해주세요.')
                        return
                    }
                    if (post.msg && post.msg.length > 200) {
                        res.writeHead(200)
                        res.end('인증 페이지 내용은 최대 200자까지 입력할 수 있어요.')
                        return
                    }
                    if (post.verifiedmsg && post.verifiedmsg.length > 2000) {
                        res.writeHead(200)
                        res.end('인증 완료 메세지는 최대 2000자까지 입력할 수 있어요.')
                        return
                    }
                    let prevConf = await db.serverConf.findOne({ _id: post.guildid })
                    if (post.channelid) prevConf.channelId = post.channelid
                    if (post.messageid) prevConf.messageId = post.messageid
                    if (post.verified) {
                        if (post.verified == 'none') {
                            prevConf.verifiedRole = null
                        } else {
                            prevConf.verifiedRole = post.verified
                        }
                    }
                    if (post.unverified) {
                        if (post.unverified == 'none') {
                            prevConf.unverifiedRole = null
                        } else {
                            prevConf.unverifiedRole = post.unverified
                        }
                    }
                    if (post.msg) prevConf.msg = post.msg
                    if (post.verifiedmsg) {
                        if (post.verifiedmsg == 'none') {
                            prevConf.verifiedMsg = null
                        } else {
                            prevConf.verifiedMsg = post.verifiedmsg
                        }
                    }
                    await db.serverConf.updateOne({ _id: post.guildid }, {
                        $set: prevConf
                    })
                    res.writeHead(200)
                    res.end('ok')
                })
            } else {
                res.writeHead(401)
                res.end('No token')
            }
        })
    }
}