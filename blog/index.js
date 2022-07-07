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
    // these old articles used very short snippets that looks bad with the wider code block
    if (window.location.href.match(/anonymous-IIFE-fn|os-dependent-emoji-display|devtools-dollar-shorthand-jquery/)) {
      const pres = document.querySelectorAll('pre')
      pres.forEach(el => el.style.setProperty('margin', '1em 0', 'important'))
    }
  }
})
