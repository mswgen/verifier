window.addEventListener('load', init)

function init() {
  window.isDev = location.hostname == 'localhost'
  window.clientID = window.isDev ? '999664038332092477' : '791863119843819520'
  window.redirectURI = window.isDev ? 'http://localhost:4430/guildselect' : 'https://verifier.mswgen.ga/guildselect'
  window.showHamburger = false
  if (localStorage.getItem('dark')) {
    if (localStorage.getItem('dark') == 'yes') {
      window.dark = false
    } else {
      window.dark = true
    }
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    window.dark = false
  } else {
    window.dark = true
  }
  darktoggle(true)
  window.addEventListener('popstate', event => {
    if (event.state) {
      if (event.state.page == 'guildselect') {
        if (!localStorage.getItem('discord')) {
	  document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
          return
        }
        fetchPage('/static/html/mounts/guildselect.html').then(() => {
          fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
        })
      } else if (event.state.page == 'dash') {
        fetchPage('/static/html/mounts/dash.html').then(() => {
          fetch('/static/js/dash.js').then(r => r.text()).then(eval)
        })
      } else if (event.state.page == 'verify') {
        if (!getParam('token')) {
          history.replaceState({page: 'root'}, 'verifier', '/')
          fetchPage('/static/html/mounts/about.html')
        } else {
          fetchPage('/static/html/mounts/verify.html').then(() => {
            fetch('/static/js/verify.js').then(r => r.text()).then(eval)
          })
        }
      } else if (event.state.page == 'verified') {
        fetchPage('/static/html/mounts/verified.html')
      } else {
        fetchPage('/static/html/mounts/about.html')
      }
    }
  })
  if (location.pathname == '/guildselect') {
    if (!getParam('code') && !localStorage.getItem('discord')) {
      document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
      return
    }
    if (getParam('code')) {
      window.dashAccessCode = getParam('code')
    }
    history.replaceState({page: 'guildselect'}, '서버 선택하기 - verifier', '/guildselect')
    fetchPage('/static/html/mounts/guildselect.html', '#mount', false).then(() => {
      fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
    })
  } else if (location.pathname == '/verify') {
    if (!getParam('token')) {
      history.replaceState({page: 'root'}, 'verifier', '/')
      fetchPage('/static/html/mounts/about.html', '#mount', false)
    } else {
      window.verifyToken = getParam('token')
      history.replaceState({page: 'verify', token: getParam('token')}, '인증하기 - verifier', '/verify')
      fetchPage('/static/html/mounts/verify.html', '#mount', false).then(() => {
        fetch('/static/js/verify.js').then(r => r.text()).then(eval)
      })
    }
  } else if (location.pathname == '/dash') {
    history.replaceState({page: 'guildselect'}, '서버 선택하기 - verifier', '/guildselect')
    if (!getParam('code') && !localStorage.getItem('discord')) {
      document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
      return
    }
    fetchPage('/static/html/mounts/guildselect.html', '#mount', false).then(() => {
      fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
    })
  } else if (location.pathname == '/verified') {
    history.replaceState({page: 'verified'}, '인증 완료 - verifier', '/verified')
    fetchPage('/static/html/mounts/verified.html', '#mount', false)
  } else {
    history.replaceState({page: 'root'}, 'verifier', '/')
    fetchPage('/static/html/mounts/about.html', '#mount', false)
  }

  document.querySelector('#skip2main').addEventListener('click', () => {
    document.querySelector('.aboutbutton').focus()
    document.querySelector('#mount').scrollIntoView()
  })
  for (let element of Array.from(document.querySelectorAll('.spa-link-about'))) {
    element.addEventListener('click', () => {
      history.pushState({page: 'root'}, 'verifier', '/')
      fetchPage('/static/html/mounts/about.html')
    })
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-logo'))) {
    element.addEventListener('click', () => {
      history.pushState({page: 'root'}, 'verifier', '/')
      fetchPage('/static/html/mounts/about.html', '#mount', false)
    })
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-help'))) {
    element.addEventListener('click', () => {
      document.location.href = 'https://discord.gg/nKaM6RrN92'
    })
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-invite'))) {
    element.addEventListener('click', () => {
      document.location.href = `https://discord.com/oauth2/authorize?client_id=${window.clientID}&permissions=8&scope=bot`
    })
  }
  for (let element of Array.from(document.querySelectorAll('.spa-link-dash'))) {
    element.addEventListener('click', () => {
      if (localStorage.getItem('discord')) {
        history.pushState({page: 'guildselect'}, '서버 선택하기 - verifier', '/guildselect')
        fetchPage('/static/html/mounts/guildselect.html').then(() => {
          fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
        })
      } else {
        document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
      }
    })
  }
  for (let element of Array.from(document.querySelectorAll('.mobile-nav-item'))) {
    element.addEventListener('click', () => {
      setTimeout(() => {
        hamburger(false)
      }, 0.5)
    })
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
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

async function fetchPage(path, element, scroll = true) {
  await fetch(path).then(async r => await r.text()).then(resp => {
    document.querySelector(element || '#mount').innerHTML = resp
    if (scroll) document.querySelector(element || '#mount').scrollIntoView()
    else window.scrollTo(0, 0)
  })
}

// eslint-disable-next-line no-unused-vars
async function post(path, body, headers, dataType) {
  const stream = await fetch(path, {
    method: 'POST',
    body,
    headers
  })
  const d = await stream[dataType]()
  return d
}

function hamburger(show) {
  window.showHamburger = show
  if (show == true) {
    document.querySelector('#hamburgermenu').classList.add('shadow-2xl')
    document.querySelector('#hamburgermenu').classList.add('ease-out')
    document.querySelector('#hamburgermenu').classList.add('translate-x-0')
    document.querySelector('#hamburgermenu').classList.remove('shadow-none')
    document.querySelector('#hamburgermenu').classList.remove('ease-in')
    document.querySelector('#hamburgermenu').classList.remove('translate-x-full')
  } else {
    document.querySelector('#hamburgermenu').classList.remove('shadow-2xl')
    document.querySelector('#hamburgermenu').classList.remove('ease-out')
    document.querySelector('#hamburgermenu').classList.remove('translate-x-0')
    document.querySelector('#hamburgermenu').classList.add('shadow-none')
    document.querySelector('#hamburgermenu').classList.add('ease-in')
    document.querySelector('#hamburgermenu').classList.add('translate-x-full')
  }
}

function darktoggle(isInit = false) {
  if (window.dark) {
    document.querySelector('html').classList.remove('dark')
    window.dark = false
    if (!isInit) localStorage.setItem('dark', 'no')
  } else {
    document.querySelector('html').classList.add('dark')
    window.dark = true
    if (!isInit) localStorage.setItem('dark', 'yes')
  }
}
