// load latest article on top
document.addEventListener('DOMContentLoaded', async () => {
  fetch('/header/latestArticle.json')
    .then(response => response.json())
    .then(json => {
      document.querySelector('#top-bar-link').href = `/blog/${json.slug}`
      document.querySelector('#top-bar-link').innerText =
        json.title.replace(/^(.{40}[^\s]*).*/, '$1') + (json.title.length > 40 ? '...' : '')
    })
})
