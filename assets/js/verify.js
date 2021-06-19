// eslint-disable-next-line no-unused-vars
function recaptchaCallback(token) {
  // eslint-disable-next-line no-undef
  post('/api/verify', undefined, {
    recaptcha: token,
    // eslint-disable-next-line no-undef
    token: getParam('token')
  }, 'text').then(stat => {
    if (stat == 'ok') {
      // eslint-disable-next-line no-undef
      fetchPage('/static/html/mounts/verified.html')
    } else {
      alert(`Error: ${stat}`)
    }
  })
}

// eslint-disable-next-line no-undef
post('/api/verifyinfo', getParam('token'), undefined, 'json').then(resp => {
  window.verification = resp
  // eslint-disable-next-line no-undef
  document.querySelector('#servertitle').innerHTML = `${verification.guild.name}<br>인증하기`
  // eslint-disable-next-line no-undef
  document.querySelector('#username').innerHTML = verification.user.name
  // eslint-disable-next-line no-undef
  document.querySelector('#verifytext').innerHTML = verification.text
  document.querySelector('#verify').addEventListener('click', () => {
    // eslint-disable-next-line no-undef
    grecaptcha.execute()
  })
  const recaptchaInject = document.createElement('script')
  recaptchaInject.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=recaptchaLoad')
  recaptchaInject.setAttribute('type', 'text/javascript')
  recaptchaInject.setAttribute('async', 'true')
  recaptchaInject.setAttribute('defer', 'true')
  document.body.appendChild(recaptchaInject)
})

// eslint-disable-next-line no-unused-vars
function recaptchaLoad() {
  document.querySelector('#verify').classList.remove('hidden')
}