if (navigator.platform.includes('Win')) {
  document.querySelector('#about-r').innerText = '👱🏻‍♂️'
  document.querySelector('#projects-r').innerText = '⚗️'
  document.querySelector('#blog-r').innerText = '📝'
} else {
  document.querySelector('#about-r').style.setProperty('--data-color', '#de7a9c')
  document.querySelector('#about-r').innerText = '[ ];'
  document.querySelector('#projects-r').innerText = '{ };'
  document.querySelector('#blog-r').innerText = '/**/'
}
