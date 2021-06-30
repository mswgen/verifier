// eslint-disable-next-line no-unused-vars
function hcaptchaCallback(token) {
  // eslint-disable-next-line no-undef
  post('/api/verify', undefined, {
    hcaptcha: token,
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
  const hcaptchaInject = document.createElement('script')
  hcaptchaInject.setAttribute('src', 'https://hcaptcha.com/1/api.js?onload=recaptchaLoad')
  hcaptchaInject.setAttribute('type', 'text/javascript')
  hcaptchaInject.setAttribute('async', 'true')
  hcaptchaInject.setAttribute('defer', 'true')
  document.body.appendChild(hcaptchaInject)
})

// eslint-disable-next-line no-unused-vars
function recaptchaLoad() {
  document.querySelector('#verify').classList.remove('hidden')
}