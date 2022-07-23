/* global post, fetchPage, verification, grecaptcha */
// eslint-disable-next-line no-unused-vars
function hcaptchaCallback(token) {
  post('/api/verify', undefined, {
    hcaptcha: token,
    token: window.verifyToken
  }, 'text').then(stat => {
    if (stat == 'ok') {
      history.pushState({page: 'verified'}, '인증 완료 - verifier', '/verified')
      fetchPage('/static/html/mounts/verified.html')
    } else {
      alert(`Error: ${stat}`)
    }
  })
}

post('/api/verifyinfo', window.verifyToken, undefined, 'json').then(resp => {
  window.verification = resp
  document.querySelector('#servertitle').innerHTML = `${verification.guild.name}<br>인증하기`
  document.querySelector('#username').innerHTML = verification.user.name
  document.querySelector('#verifytext').innerHTML = verification.text
  document.querySelector('#verify').addEventListener('click', () => {
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