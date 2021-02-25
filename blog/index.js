'use strict'

// code formatting by adding Prism.js
document.addEventListener('DOMContentLoaded', () => {
  const pre = document.querySelector('pre')
  if (pre) {
    const prismStylesheet = document.createElement('link')
    prismStylesheet.rel = 'stylesheet'
    prismStylesheet.href = '/assets/prism.css'
    document.head.appendChild(prismStylesheet)

    const prismScript = document.createElement('script')
    prismScript.src = '/assets/prism.js'
    document.body.appendChild(prismScript)
  }
})
