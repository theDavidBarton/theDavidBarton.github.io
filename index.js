'use strict'

window.onresize = function () {
  if (
    window.innerWidth > window.innerHeight &&
    document.querySelector('#mobileNav') &&
    document.querySelector('#mobileNav').style.display !== 'none'
  ) {
    activateMobileNav()
  }
}

function getUrlFromLink() {
  const trustedLinks = [
    'https://trending-video-games.herokuapp.com/',
    'https://trending-movies-react-app.herokuapp.com/',
    'https://thedavidbarton.herokuapp.com/',
    'https://twin-peaks-api.herokuapp.com/',
    'https://the-harry-potter-database.herokuapp.com/'
  ]
  const urlSelector = window.location.href.match(/url(.*)/) ? window.location.href.match(/url(.*)/)[0] : window.location.href
  const url = urlSelector.replace('url=', '')
  const baseUrlMatcher = url.match(/^https:\/\/(.*?)\//)[0]
  if (trustedLinks.includes(baseUrlMatcher)) {
    if (!window.InstallTrigger) {
      document.querySelector('#refresh').content = `0; URL='${url}'`
    } else {
      window.setTimeout(() => {
        window.location.href = url
      }, 6000)
    }
  }
}

function activateMobileNav() {
  document.querySelector('#mobileNav').style.display !== 'none'
    ? (document.querySelector('#mobileNav').style.display = 'none') &&
      (document.querySelector('#mobileNavOverlay').style.display = 'none')
    : (document.querySelector('#mobileNav').style.display = 'block') &&
      (document.querySelector('#mobileNavOverlay').style.display = 'block')

  document.querySelector('#mobileNav').style.display !== 'none'
    ? (document.querySelector('body').style.position = 'fixed')
    : (document.querySelector('body').style.position = 'unset')
}

async function getQuote() {
  try {
    const prodUrl = /https:\/\/thedavidbarton\.github\.io\//gi
    let obj
    let response
    // reduce load on twin peaks api during development
    if (window.location.href.match(prodUrl)) {
      response = await fetch('https://thedavidbarton.herokuapp.com/api/1/quotes/recommend?relevance=1&profanity=false')
      await response.json().then(data => (obj = data[0]))
    } else {
      response =
        '[{"quoteTextOnly":"There\'s a sort of evil out there. Something very, very strange in these old woods. \\nCall it what you want. A darkness, a presence. It takes many forms but... its been out there for as long as anyone can remember and we\'ve always been here to fight it. [DEV MODE]","persons":["Sheriff Truman"]}]'
      obj = JSON.parse(response)[0]
      console.log('%cDEV MODE: on', 'color:#000000; background-color:#ffc107')
    }
    let quoteTextOnly = obj.quoteTextOnly.replace(/\n/gm, ' / ')
    quoteTextOnly.length >= 380 ? (quoteTextOnly = quoteTextOnly.substring(0, 380) + '...') : (quoteTextOnly = quoteTextOnly)
    const persons = obj.persons.map(el => el)
    document.querySelector('#twinpeaks-quote > p').innerHTML = quoteTextOnly
    document.querySelector('#twinpeaks-quote > footer > cite').innerHTML = persons
  } catch (e) {
    console.error(e)
  }
}

async function getRepos() {
  try {
    const prodUrl = /https:\/\/thedavidbarton\.github\.io\//gi
    let obj
    let response
    // reduce load on github api during development
    if (window.location.href.match(prodUrl)) {
      response = await fetch('https://api.github.com/users/theDavidBarton')
      await response.json().then(data => (obj = data))
    } else {
      response = '{"public_repos": 20}'
      obj = JSON.parse(response)
    }
    const publicRepos = obj.public_repos
    document.querySelector('#ghRepos').textContent = publicRepos
    document.querySelector('#ghReposMobile').textContent = publicRepos
  } catch (e) {
    console.error(e)
  }
}

async function getStreak() {
  try {
    const prodUrl = /https:\/\/thedavidbarton\.github\.io\//gi
    let obj
    let response
    // reduce load on my heroku api during development
    if (window.location.href.match(prodUrl)) {
      response = await fetch('https://thedavidbarton.herokuapp.com/api/1/github-streak/theDavidBarton')
      await response.json().then(data => (obj = data))
    } else {
      response = '{"currentStreakCount":12}'
      obj = JSON.parse(response)
    }
    const currentStreakCount = obj.currentStreakCount
    document.querySelector('#ghStreak').textContent = currentStreakCount
    document.querySelector('#ghStreakMobile').textContent = currentStreakCount
    currentStreakCount == 1
      ? (document.querySelector('#ghStreakSubText').textContent = 'day')
      : (document.querySelector('#ghStreakSubText').textContent = 'days')
  } catch (e) {
    console.error(e)
  }
}

function getDate() {
  const today = new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
  document.querySelector('#funfactDataDate').textContent = today
  document.querySelector('#funfactDataDateMobile').textContent = today
}
