!(() => {
  const prismStylesheet = document.createElement('link')
  prismStylesheet.rel = 'stylesheet'
  prismStylesheet.href = '/assets/prism.css'
  document.head.appendChild(prismStylesheet)

  const prismScript = document.createElement('script')
  prismScript.src = '/assets/prism.js'
  document.body.appendChild(prismScript)
})()

!(() => {
  const img = document.querySelectorAll('article > * > img')
  const bootstrapClasses = ['img-fluid', 'mx-auto', 'd-block']
  img.forEach(el => el.classList.add(...bootstrapClasses))
})()
