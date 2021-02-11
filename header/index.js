// load latest article on top
document.addEventListener('DOMContentLoaded', () => {
  fetch('/header/latestArticle.json')
    .then(response => response.json())
    .then(json => {
      document.querySelector('#top-bar-link').href = `/blog/${json.slug}`
      document.querySelector('#top-bar-link').innerText =
        json.title.replace(/^(.{40}[^\s]*).*/, '$1') + (json.title.length > 40 ? '...' : '')
    })
})

// transition of top bar
document.addEventListener('DOMContentLoaded', () => {
  const topBar = document.querySelector('#top-bar-text')
  window.setTimeout(() => {
    topBar.style.opacity = '1'
  }, 500)
})
