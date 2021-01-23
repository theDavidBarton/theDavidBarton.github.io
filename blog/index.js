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

// style images with bootstrap dynmically
document.addEventListener('DOMContentLoaded', () => {
  const img = document.querySelectorAll('article > * > img')
  const bootstrapClasses = ['img-fluid', 'mx-auto', 'd-block']
  img.forEach(el => el.classList.add(...bootstrapClasses))
})

// handle "Read more" of the blog summaries
const toggleLead = leadId => {
  const lead = document.querySelector(`.lead-${leadId}`)
  const toggle = document.querySelector(`.toggle-lead-${leadId}`)

  if (window.getComputedStyle(lead).getPropertyValue('display') !== 'block') {
    lead.style.display = 'block'
    toggle.style.color = 'red'
    toggle.innerText = 'summary «'
  } else {
    lead.style.display = 'none'
    toggle.style.color = 'blue'
    toggle.innerText = 'summary »'
  }
}
