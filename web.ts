import https from 'https'
import http from 'http'
import url from 'url'
import fs from 'fs/promises'
import path from 'path'
import Discord from 'discord.js'
import type mongodb from 'mongodb'
export default {
  start: async (client: Discord.Client, db: { serverConf: mongodb.Collection, notifications: mongodb.Collection }) => {
    const httpServer = http.createServer((req, res) => {
      let parsed = url.parse(req.url as string, true)
      if ((parsed.pathname as string).startsWith('/.well-known/acme-challenge/')) {
        fs.readFile(`./.well-known/acme-challenge/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
          res.writeHead(200)
          res.end(data)
        }).catch(() => {
          res.writeHead(404, {
            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
          })
          res.end('404 Not Found')
          return
        })
      } else {
        res.writeHead(302, {
          'Location': `https://${process.env.DOMAIN}${req.url}`
        })
        res.end()
      }
    })
    httpServer.listen(8000, () => {
      console.log('http server started')
    })
    const httpsServer = https.createServer({
      cert: await fs.readFile('/etc/letsencrypt/live/verifier.teamint.xyz/fullchain.pem', 'utf8'),
      key: await fs.readFile('/etc/letsencrypt/live/verifier.teamint.xyz/privkey.pem', 'utf8')
    }, (req, res) => {
      let parsed = url.parse(req.url as string, true)
      if ((parsed.pathname as string).startsWith('/.well-known/acme-challenge/')) {
        fs.readFile(`./.well-known/acme-challenge/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
          res.writeHead(200)
          res.end(data)
        }).catch(() => {
          res.writeHead(404, {
            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
          })
          res.end('404 Not Found')
          return
        })
      } else if ((parsed.pathname as string).startsWith('/static/')) {
        if ((parsed.pathname as string).startsWith('/static/html/')) {
          if ((parsed.pathname as string).startsWith('/static/html/mounts/')) {
            fs.readFile(`./assets/html/mounts/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
              res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8',
                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
              })
              res.end(data)
            }).catch(() => {
              res.writeHead(404, {
                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
              })
              res.end('404 Not Found')
              return
            })
          } else {
            fs.readFile(`./assets/html/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
              res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8',
                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
              })
              res.end(data)
            }).catch(() => {
              res.writeHead(404, {
                // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
              })
              res.end('404 Not Found')
              return
            })
          }
        } else if ((parsed.pathname as string).startsWith('/static/css/')) {
          fs.readFile(`./assets/css/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
            res.writeHead(200, {
              'Content-Type': 'text/css; charset=UTF-8',
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end(data)
          }).catch(() => {
            res.writeHead(404, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('404 Not Found')
            return
          })
        } else if ((parsed.pathname as string).startsWith('/static/js/')) {
          fs.readFile(`./assets/js/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
            res.writeHead(200, {
              'Content-Type': 'text/javascript; charset=UTF-8',
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end(data)
          }).catch(() => {
            res.writeHead(404, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('404 Not Found')
            return
          })
        } else if ((parsed.pathname as string).startsWith('/static/image/png/')) {
          fs.readFile(`./assets/image/png/${path.parse(parsed.pathname as string).base}`).then(data => {
            res.writeHead(200, {
              'Content-Type': 'image/png',
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end(data)
          }).catch(() => {
            res.writeHead(404, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('404 Not Found')
            return
          })
        } else if ((parsed.pathname as string).startsWith('/static/image/svg/')) {
          fs.readFile(`./assets/image/svg/${path.parse(parsed.pathname as string).base}`, 'utf8').then(data => {
            res.writeHead(200, {
              'Content-Type': 'image/svg+xml; charset=UTF-8',
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end(data)
          }).catch(() => {
            res.writeHead(404, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('404 Not Found')
            return
          })
        } else if ((parsed.pathname as string).startsWith('/static/image/webp/')) {
          fs.readFile(`./assets/image/webp/${path.parse(parsed.pathname as string).base}`).then(data => {
            res.writeHead(200, {
              'Content-Type': 'image/webp',
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end(data)
          }).catch(() => {
            res.writeHead(404, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('404 Not Found')
            return
          })
        } else if ((parsed.pathname as string).startsWith('/static/json/')) {
          fs.readFile(`./assets/json/${path.parse(parsed.pathname as string).base}`).then(data => {
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=UTF-8',
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end(data)
          }).catch(() => {
            res.writeHead(404, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('404 Not Found')
            return
          })
        } else {
          res.writeHead(404, {
            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
          })
          res.end('404 Not Found')
        }
      } else if (parsed.pathname == '/manifest.json') {
        res.writeHead(200, {
          'content-type': 'application/json; charset=UTF-8',
          // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
        });
        fs.readFile('./assets/json/manifest.json', 'utf8').then(data => {
          res.end(data);
        });
      } else if (parsed.pathname == '/serviceWorker.js') {
        res.writeHead(200, {
          'content-type': 'text/javascript; charset=UTF-8',
          // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
        });
        fs.readFile('./assets/js/serviceWorker.js', 'utf8').then(data => {
          res.end(data);
        });
      } else {
        if ((client as any).paths.get(parsed.pathname)) {
          if ((client as any).paths.get(parsed.pathname).method as string == req.method) {
            (client as any).paths.get(parsed.pathname).run(client, db, req, res, parsed)
          } else {
            res.writeHead(405, {
              // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
            })
            res.end('405 Method Not Allowed')
          }
        } else {
          res.writeHead(404, {
            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload'
          })
          res.end('404 Not Found')
        }
      }
    })
    httpsServer.listen(4430, () => {
      console.log('https server started')
    })
  }
}
