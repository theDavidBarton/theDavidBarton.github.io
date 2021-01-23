// print date
document.addEventListener('DOMContentLoaded', () => {
  const funFact = document.querySelector('#funfactDataDate')
  const thisYear = document.querySelector('#thisYear')
  const today = new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
  funFact ? (funFact.textContent = today) : null
  thisYear.textContent = today.match(/\d{4}/)[0]
})

// mailto
document.addEventListener('DOMContentLoaded', () => {
  const mail = document.querySelector('#mailto')
  window.setTimeout(() => {
    if (window.location.pathname.includes('/blog')) {
      mail.innerText = mail.innerText.replace(/theDavidBartonMail/, 'AOL')
    }
    mail.href = mail.href.replace(/theDavidBartonMail/, 'AOL')
  }, 3000)
})
