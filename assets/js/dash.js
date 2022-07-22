/* eslint-disable no-undef */
if (!window.accessToken) {
  document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
}

post('/api/getconf', window.guildInfo.id, {
  authorization: window.accessToken
}, 'json').then(resp => {
  if (resp.status >= 400) {
    history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
    if (!localStorage.getItem('discord')) {
      document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
      return
    }
    fetchPage('/static/html/mounts/guildselect.html').then(() => {
      fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
    })
    return
  }
  if (resp.stat == 'offline') {
    return fetchPage('/static/html/mounts/offline.html')
  }
  document.querySelector('#guildname').innerHTML = window.guildInfo.name
  for (let chs of resp.availableChannels) {
    const elem = document.createElement('option')
    elem.innerHTML = chs.name
    elem.setAttribute('value', chs.id)
    elem.setAttribute('id', `ch-${chs.id}`)
    document.querySelector('#channelid').appendChild(elem)
  }
  document.querySelector('#channelid').children[0].remove()
  document.querySelector('#messageid').value = resp.messageid
  for (let chs of resp.availableRoles) {
    const elem = document.createElement('option')
    elem.innerHTML = chs.name
    elem.setAttribute('value', chs.id)

    elem.setAttribute('id', `verified-${chs.id}`)
    document.querySelector('#verified').appendChild(elem)
  }
  for (let chs of resp.availableRoles) {
    const elem = document.createElement('option')
    elem.innerHTML = chs.name
    elem.setAttribute('value', chs.id)
    elem.setAttribute('id', `unverified-${chs.id}`)
    document.querySelector('#unverified').appendChild(elem)
  }
  if (document.querySelector(`#ch-${resp.channelid}`)) document.querySelector(`#ch-${resp.channelid}`).setAttribute('selected', 'true')
  document.querySelector('#messageid').value = resp.messageid
  if (document.querySelector(`#verified-${resp.verified}`)) document.querySelector(`#verified-${resp.verified}`).setAttribute('selected', 'true')
  if (document.querySelector(`#unverified-${resp.unverified}`)) document.querySelector(`#unverified-${resp.unverified}`).setAttribute('selected', 'true')
  document.querySelector('#msg').value = resp.msg
  document.querySelector('#verifiedmsg').value = resp.verifiedmsg
  document.querySelector('#channelid').addEventListener('change', () => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      channelid: document.querySelector('#channelid').value
    }), {
      authorization: window.accessToken
    }, 'text').then(r => {
      try {
        if (JSON.parse(r).stat == 'offline') {
          return alert('지금 오프라인 상태에요. 인터넷에 연결한 다음 다시 시도해주세요.')
        }
      } catch (e) {
        if (r == 'error') {
          alert('이 서버의 설정을 바꿀 수 없어요.')
          history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
          if (!localStorage.getItem('discord')) {
            document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
            return
          }
          return fetchPage('/static/html/mounts/guildselect.html').then(() => {
            fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
          })
        } else if (r != 'ok') {
          alert(r)
        }
      }
    })
  })
  document.querySelector('#messageid').addEventListener('change', () => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      messageid: document.querySelector('#messageid').value,
      channelid: document.querySelector('#channelid').value
    }), {
      authorization: window.accessToken
    }, 'text').then(r => {
      try {
        if (JSON.parse(r).stat == 'offline') {
          return alert('지금 오프라인 상태에요. 인터넷에 연결한 다음 다시 시도해주세요.')
        }
      } catch (e) {
        if (r == 'error') {
          alert('이 서버의 설정을 바꿀 수 없어요.')
          history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
          if (!localStorage.getItem('discord')) {
            return
          }
          return fetchPage('/static/html/mounts/guildselect.html').then(() => {
            fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
          })
        } else if (r != 'ok') {
          alert(r)
        }
      }
    })
  })
  document.querySelector('#unverified').addEventListener('change', () => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      unverified: document.querySelector('#unverified').value || 'none'
    }), {
      authorization: window.accessToken
    }, 'text').then(r => {
      try {
        if (JSON.parse(r).stat == 'offline') {
          return alert('지금 오프라인 상태에요. 인터넷에 연결한 다음 다시 시도해주세요.')
        }
      } catch (e) {
        if (r == 'error') {
          alert('이 서버의 설정을 바꿀 수 없어요.')
          history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
          if (!localStorage.getItem('discord')) {
           document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
            return
          }
          return fetchPage('/static/html/mounts/guildselect.html').then(() => {
            fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
          })
        } else if (r != 'ok') {
          alert(r)
        }
      }
    })
  })
  document.querySelector('#verified').addEventListener('change', () => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      verified: document.querySelector('#verified').value || 'none'
    }), {
      authorization: window.accessToken
    }, 'text').then(r => {
      try {
        if (JSON.parse(r).stat == 'offline') {
          return alert('지금 오프라인 상태에요. 인터넷에 연결한 다음 다시 시도해주세요.')
        }
      } catch (e) {
        if (r == 'error') {
          alert('이 서버의 설정을 바꿀 수 없어요.')
          history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
          if (!localStorage.getItem('discord')) { 
	    document.location.href = `https://discord.com/api/oauth2/authorize?client_id=${window.clientID}&redirect_uri=${encodeURIComponent(window.redirectURI)}&response_type=code&scope=identify%20guilds`
            return
          }
          return fetchPage('/static/html/mounts/guildselect.html').then(() => {
            fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
          })
        } else if (r != 'ok') {
          alert(r)
        }
      }
    })
  })
  document.querySelector('#verifiedmsg').addEventListener('change', () => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      verifiedmsg: document.querySelector('#verifiedmsg').value || 'none'
    }), {
      authorization: window.accessToken
    }, 'text').then(r => {
      try {
        if (JSON.parse(r).stat == 'offline') {
          return alert('지금 오프라인 상태에요. 인터넷에 연결한 다음 다시 시도해주세요.')
        }
      } catch (e) {
        if (r == 'error') {
          alert('이 서버의 설정을 바꿀 수 없어요.')
          history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
          if (!localStorage.getItem('discord')) {
            return
          }
          return fetchPage('/static/html/mounts/guildselect.html').then(() => {
            fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
          })
        } else if (r != 'ok') {
          alert(r)
        }
      }
    })
  })
  document.querySelector('#msg').addEventListener('change', () => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      msg: document.querySelector('#msg').value
    }), {
      authorization: window.accessToken
    }, 'text').then(r => {
      try {
        if (JSON.parse(r).stat == 'offline') {
          return alert('지금 오프라인 상태에요. 인터넷에 연결한 다음 다시 시도해주세요.')
        }
      } catch (e) {
        if (r == 'error') {
          alert('이 서버의 설정을 바꿀 수 없어요.')
          history.replaceState({ page: 'guildselect' }, '서버 선택하기 - verifier', '/guildselect')
          if (!localStorage.getItem('discord')) {
            return
          }
          return fetchPage('/static/html/mounts/guildselect.html').then(() => {
            fetch('/static/js/guildselect.js').then(r => r.text()).then(eval)
          })
        } else if (r != 'ok') {
          alert(r)
        }
      }
    })
  })
})
