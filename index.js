'use strict'

async function getQuote() {
  try {
    const prodUrl = /https:\/\/thedavidbarton\.github\.io\//gi
    let obj
    let response
    // reduce load on twin peaks api during development
    if (window.location.href.match(prodUrl)) {
      response = await fetch('https://twin-peaks-api.herokuapp.com/api/1/quotes/recommend?relevance=1&profanity=false')
      await response.json().then(data => {
        obj = data[0]
      })
    } else {
      response =
        '[{"quoteTextOnly":"There\'s a sort of evil out there. Something very, very strange in these old woods. Call it what you want. A darkness, a presence. It takes many forms but... its been out there for as long as anyone can remember and we\'ve always been here to fight it. [DEV MODE]","persons":["Sheriff Truman"]}]'
      obj = JSON.parse(response)[0]
      console.log('DEV MODE: on')
    }
    let quoteTextOnly = obj.quoteTextOnly
    quoteTextOnly.length >= 380
      ? (quoteTextOnly = quoteTextOnly.substring(0, 380) + '...')
      : (quoteTextOnly = quoteTextOnly)
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
      await response.json().then(data => {
        obj = data
      })
    } else {
      response = '{"public_repos": 20}'
      obj = JSON.parse(response)
    }
    const publicRepos = obj.public_repos
    document.querySelector('#ghRepos').textContent = publicRepos
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
      await response.json().then(data => {
        obj = data
      })
    } else {
      response =
        '{"user":"theDavidBarton","currentlyOnStreak":true,"currentStreakCount":11,"currentStreakStartDate":"2019-12-30"}'
      obj = JSON.parse(response)
    }
    const currentStreakCount = obj.currentStreakCount
    document.querySelector('#ghStreak').textContent = currentStreakCount
  } catch (e) {
    console.error(e)
  }
}
