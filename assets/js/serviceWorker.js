let cacheFiles = [
  '/',
  '/static/html/mounts/about.html',
  '/static/css/compiled.css',
  '/static/js/spa.js',
  '/static/html/mounts/offline.html',
  '/static/image/svg/mountain.svg',
  '/static/image/svg/light.svg',
  '/static/image/webp/inticon.webp',
  '/static/image/png/inticon-144.png',
  '/static/image/png/inticon-512.png',
  '/static/html/mounts/verified.html'
]
let name = 'chche-v11'
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(name).then(cache => {
      return cache.addAll(cacheFiles)
    })
  )
})
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName != name) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response
        let fetchRequest = event.request.clone()
        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') return response
          let responseToCache = response.clone()
          if (!cacheFiles.includes(event.request.url)) return response
          caches.open(name)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })
          return response
        }).catch(() => {
          return caches.open(name).then(async cache => {
            return await cache.match('/static/html/mounts/offline.html')
          })
        })
      })
  )
})
self.addEventListener('notificationclick', e => {
  e.notification.close()
})
self.addEventListener('push', e => {
  e.waitUntil(
    self.registration.showNotification(e.data.json().title, {
      body: e.data.json().body,
      icon: e.data.json().icon,
      data: {
        dateOfArrival: Date.now()
      },
      vibrate: [100, 50, 100],
      badge: '/static/image/png/inticon-without-background.png'
    })
  )
})