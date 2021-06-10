if (localStorage.getItem('discord')) {
  post('/api/tokenrefresh', localStorage.getItem('discord'), undefined, 'json').then(resp => {
    localStorage.setItem('discord', resp.refresh)
    window.accessToken = resp.access
    post('/api/getguilds', window.accessToken, undefined, 'json').then(displayGuilds)
  })
} else if (getParam('code')) {
  post('/api/gettoken', getParam('code'), undefined, 'json').then(resp => {
    localStorage.setItem('discord', resp.refresh)
    window.accessToken = resp.access
    post('/api/getguilds', window.accessToken, undefined, 'json').then(displayGuilds)
  })
} else {
  fetchPage('/static/html/mounts/about.html')
}

function displayGuilds(list) {
  for (let x of list) {
    const element = document.createElement('div')
    element.setAttribute('class', 'flex flex-row p-10 m-2 row-auto rounded-2x1 border-0 bg-card dark:bg-black')
    const childElement = document.createElement('div')
    childElement.setAttribute('class', 'text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-red-400 to-pink-500 grid grid-cols-2 grid-rows-1')
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
        name: x.name,
        id: x.id
      }
      fetchPage('/static/html/mounts/dash.html').then(() => {
        fetch('/static/js/new-dash.js').then(r => r.text()).then(eval)
      })
    })
  }
}