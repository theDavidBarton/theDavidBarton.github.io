'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const pre = document.querySelector('pre')
  // code formatting by adding Prism.js
  if (pre) {
    const prismStylesheet = document.createElement('link')
    prismStylesheet.rel = 'stylesheet'
    prismStylesheet.href = '/assets/prism.css'
    document.head.appendChild(prismStylesheet)

    const prismScript = document.createElement('script')
    prismScript.src = '/assets/prism.js'
    document.body.appendChild(prismScript)
    // these old articles used very short snippets that looks bad with the wider code block
    if (window.location.href.match(/anonymous-IIFE-fn|os-dependent-emoji-display|devtools-dollar-shorthand-jquery|gh-pages-upgrade-2023/)) {
      const pres = document.querySelectorAll('pre')
      pres.forEach(el => el.style.setProperty('margin', '1em 0', 'important'))
    }
  }
  const imgs = document.querySelectorAll('article img')
  // make blog images clickable so they can see in original size
  imgs.forEach(el => {
    const parent = el.parentNode
    const wrapper = document.createElement('a')
    parent.replaceChild(wrapper, el)
    wrapper.appendChild(el)
    wrapper.classList.add('blog-img')
    wrapper.href = el.src
  })
  // these articles require bigger images
  if (window.location.href.match(/heroku-to-render-dot-com/)) {
    imgs.forEach(el => el.classList.add('big-blog-img'))
  }
})
