if (!window.accessToken) {
  document.location.href = 'https://discord.com/api/oauth2/authorize?client_id=791863119843819520&redirect_uri=https%3A%2F%2Fverifier.teamint.xyz&2Fstatic%2Fhtml%2Fnew.html&response_type=code&scope=identify%20guilds'
}

post('/api/getconf', window.guildInfo.id, {
  Authorization: window.accessToken
}, 'json').then(resp => {
  document.querySelector('#guildname').innerHTML = window.guildInfo.name
  document.querySelector('#channelid').value = resp.channelid
  document.querySelector('#messageid').value = resp.messageid
  document.querySelector('#unverified').value = resp.unverified
  document.querySelector('#verified').value = resp.verified
  document.querySelector('#msg').value = resp.msg
  document.querySelector('#verifiedmsg').value = resp.verifiedmsg
  document.querySelector('#channelid').addEventListener('change', e => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      channelid: document.querySelector('#channelid').value
    }), {
      Authorization: window.accessToken
    }, 'text').then(r => {
      if (r == 'error') {
        alert('이 서버의 설정을 바꿀 수 없어요.')
        fetchPage('/static/html/mounts/guildselect.html')
      } else if (r != 'ok') {
        alert(r)
      }
    })
  })
  document.querySelector('#messageid').addEventListener('change', e => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      messageid: document.querySelector('#messageid').value,
      channelid: document.querySelector('#channelid').value
    }), {
      Authorization: window.accessToken
    }, 'text').then(r => {
      if (r == 'error') {
        alert('이 서버의 설정을 바꿀 수 없어요.')
        fetchPage('/static/html/mounts/guildselect.html')
      } else if (r != 'ok') {
        alert(r)
      }
    })
  })
  document.querySelector('#unverified').addEventListener('change', e => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      unverified: document.querySelector('#unverified').value || 'none'
    }), {
      Authorization: window.accessToken
    }, 'text').then(r => {
      if (r == 'error') {
        alert('이 서버의 설정을 바꿀 수 없어요.')
        fetchPage('/static/html/mounts/guildselect.html')
      } else if (r != 'ok') {
        alert(r)
      }
    })
  })
  document.querySelector('#verified').addEventListener('change', e => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      verified: document.querySelector('#verified').value || 'none'
    }), {
      Authorization: window.accessToken
    }, 'text').then(r => {
      if (r == 'error') {
        alert('이 서버의 설정을 바꿀 수 없어요.')
        fetchPage('/static/html/mounts/guildselect.html')
      } else if (r != 'ok') {
        alert(r)
      }
    })
  })
  document.querySelector('#verifiedmsg').addEventListener('change', e => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      verifiedmsg: document.querySelector('#verifiedmsg').value || 'none'
    }), {
      Authorization: window.accessToken
    }, 'text').then(r => {
      if (r == 'error') {
        alert('이 서버의 설정을 바꿀 수 없어요.')
        fetchPage('/static/html/mounts/guildselect.html')
      } else if (r != 'ok') {
        alert(r)
      }
    })
  })
  document.querySelector('#msg').addEventListener('change', e => {
    post('/api/editconf', JSON.stringify({
      guildid: window.guildInfo.id,
      msg: document.querySelector('#msg').value 
    }), {
      Authorization: window.accessToken
    }, 'text').then(r => {
      if (r == 'error') {
        alert('이 서버의 설정을 바꿀 수 없어요.')
        fetchPage('/static/html/mounts/guildselect.html')
      } else if (r != 'ok') {
        alert(r)
      }
    })
  })
})