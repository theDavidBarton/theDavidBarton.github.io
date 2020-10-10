if (navigator.platform.includes('Win')) {
  document.querySelector('#about-r').innerText = '👱🏻‍♂️'
  document.querySelector('#projects-r').innerText = '⚗️'
  document.querySelector('#blog-r').innerText = '📝'
} else {
  document.querySelector('#about-r').innerText = '#'
  document.querySelector('#projects-r').innerText = '{ };'
  document.querySelector('#blog-r').innerText = '/**/'
}

function getLatestArticle() {
  fetch('/header/latestArticle.json')
    .then(response => response.json())
    .then(json => {
      document.querySelector('#top-bar-link').href = `/blog/${json.slug}`
      document.querySelector('#top-bar-link').innerText =
        json.title.replace(/^(.{40}[^\s]*).*/, '$1') + (json.title.length > 40 ? '...' : '')
    })
}
getLatestArticle()
