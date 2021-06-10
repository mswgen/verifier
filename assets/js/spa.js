window.addEventListener('load', init)

function init () {
  if (getParam('state')) {
    if (getParam('state') == 'dash') {
      if (!getParam('code')) {
        document.location.href = 'https://discord.com/api/oauth2/authorize?client_id=791863119843819520&redirect_uri=https%3A%2F%2Fverifier.teamint.xyz&2Fstatic%2Fhtml%2Fnew.html&response_type=code&scope=identify%20guilds'
        return
      }
      fetchPage('/static/html/mounts/guildselect.html').then(() => {
        fetch('/static/js/new-guildselect.js').then(r => r.text()).then(eval)
      })
    }
  } else {
    fetchPage('/static/html/mounts/about.html')
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-about'))) {
    element.addEventListener('click', () => {
      fetchPage('/static/html/mounts/about.html')
    })
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-help'))) {
    element.addEventListener('click', () => {
      document.location.href = 'https://discord.gg/nKaM6RrN92'
    })
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-dash'))) {
    element.addEventListener('click', () => {
      if (localStorage.getItem('discord')) {
        fetchPage('/static/html/mounts/guildselect.html').then(() => {
          fetch('/static/js/new-guildselect.js').then(r => r.text()).then(eval)
        })
      } else {
        document.location.href = 'https://discord.com/api/oauth2/authorize?client_id=791863119843819520&redirect_uri=https%3A%2F%2Fverifier.teamint.xyz%2Fstatic%2Fhtml%2Fnew.html&response_type=code&scope=identify%20guilds&state=dash'
      }
    })
  }
}

function getParam(sname) {
  let params = location.search.substr(location.search.indexOf('?') + 1)
  let sval = ''
  params = params.split('&')
  for (let i = 0; i < params.length; i++) {
    let temp = params[i].split('=')
    if ([temp[0]] == sname) {
      sval = temp[1]
    }
  }
  return sval
}

async function fetchPage(path, element) {
  await fetch(path).then(async r => await r.text()).then(resp => {
    document.querySelector(element || '#mount').innerHTML = resp
    window.scrollTo(0, 0)
  })
}

async function post(path, body, headers, dataType) {
  const stream = await fetch(path, {
    method: 'POST',
    body,
    headers
  })
  const d = await stream[dataType]()
  return d
}