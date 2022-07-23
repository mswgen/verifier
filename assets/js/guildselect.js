/* global post, fetchPage */
if (localStorage.getItem('discord')) {
  post('/api/tokenrefresh', localStorage.getItem('discord'), undefined, 'json').then(resp => {
    if (resp.stat == 'offline') {
      return fetchPage('/static/html/mounts/offline.html')
    }
    if (resp.code == 1) {
      localStorage.removeItem('discord')
      document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
      return
    }
    localStorage.setItem('discord', resp.refresh)
    window.accessToken = resp.access
    post('/api/getguilds', window.accessToken, undefined, 'json').then(r => {
      if (r.stat == 'offline') {
        return fetchPage('/static/html/mounts/offline.html')
      }
      return displayGuilds(r)
    })
  })
} else if (window.dashAccessCode) {
  post('/api/gettoken', window.dashAccessCode, undefined, 'json').then(resp => {
    if (resp.stat == 'offline') {
      return fetchPage('/static/html/mounts/offline.html')
    }
    localStorage.setItem('discord', resp.refresh)
    window.accessToken = resp.access
    post('/api/getguilds', window.accessToken, undefined, 'json').then(r => {
      if (r.stat == 'offline') {
        return fetchPage('/static/html/mounts/offline.html')
      }
      return displayGuilds(r)
    })
  })
} else {
  document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
}

function displayGuilds(list) {
  for (let x of list) {
    const element = document.createElement('button')
    element.setAttribute('class', 'flex flex-row p-10 m-2 row-auto rounded-2x1 border-0 bg-card dark:bg-black guild-select-button a11y-outline')
    const childElement = document.createElement('div')
    childElement.setAttribute('class', 'text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-red-400 to-pink-500 grid grid-cols-2 grid-rows-1 my-auto')
    element.appendChild(childElement)
    const img = document.createElement('img')
    img.setAttribute('src', x.icon ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png')
    img.setAttribute('class', 'my-auto')
    childElement.appendChild(img)
    const guildName = document.createElement('p')
    guildName.innerHTML = x.name
    guildName.setAttribute('class', 'my-auto ml-4 break-all')
    childElement.appendChild(guildName)
    document.querySelector('#guild-select-mount').appendChild(element)
    element.addEventListener('click', () => {
      window.guildInfo = {
        id: x.id,
        name: x.name
      }
      history.pushState({page: 'dash', guildid: x.id, guildname: x.name}, '대시보드 - verifier', `/dash?guildid=${x.id}&guildname=${x.name}`)
      fetchPage('/static/html/mounts/dash.html').then(() => {
        fetch('/static/js/dash.js').then(r => r.text()).then(eval)
      })
    })
  }
}
