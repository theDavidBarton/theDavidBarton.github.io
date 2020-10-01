'use strict'

function prodUrl() {
  return /https:\/\/thedavidbarton\.github\.io\//gi
}

function numberToK(n) {
  // works till 999999
  if (n >= 1e3) return `${+(n / 1e3).toFixed(1)}K`
  else return n
}

// portfolio projects

function portfolioProjectsFn() {
  const object = [
    {
      id: 0,
      title: 'Trending Movies app',
      imgSrc: 'img/portfolio/tmdb',
      projectDemoUrl: '/redirect.html?url=https://trending-movies-react-app.herokuapp.com/',
      projectSourceUrl: 'https://github.com/theDavidBarton/trending-movies-react-app',
      techStack: ['Node.Js', 'React.Js']
    },
    {
      id: 1,
      title: 'Trending Video Games app',
      imgSrc: 'img/portfolio/rawg',
      projectDemoUrl: '/redirect.html?url=https://trending-video-games.herokuapp.com/',
      projectSourceUrl: 'https://github.com/theDavidBarton/video-games-on-RAWG-react-app',
      techStack: ['Node.Js', 'React.Js']
    },
    {
      id: 2,
      title: 'The Harry Potter Database',
      imgSrc: 'img/portfolio/thpdb',
      projectDemoUrl: '/redirect.html?url=https://the-harry-potter-database.herokuapp.com/',
      projectSourceUrl: 'https://github.com/theDavidBarton/the-harry-potter-database',
      techStack: ['Node.Js', 'React.Js']
    },
    {
      id: 3,
      title: 'Pixel Art Project',
      imgSrc: 'img/portfolio/pixel',
      projectDemoUrl: 'https://thedavidbarton.github.io/pixel-art/',
      projectSourceUrl: 'https://github.com/theDavidBarton/pixel-art',
      techStack: ['Node.Js', 'React.Js', 'GIMP']
    }
  ]
  return object
}

function portfolio() {
  const portfolioProjects = portfolioProjectsFn()
  const carouselItems = document.querySelectorAll('.item')
  const carouselExternalDemosImg = document.querySelectorAll('.item > a:nth-child(1)')
  const carouselImagesWebp = document.querySelectorAll('.item-img-webp')
  const carouselImagesJpeg = document.querySelectorAll('.item-img-jpeg')
  const carouselImages = document.querySelectorAll('.item-img')
  const carouselHeadings = document.querySelectorAll('.item > h3')
  const carouselExternalSource = document.querySelectorAll('.item > a:nth-child(3)')
  const carouselExternalDemos = document.querySelectorAll('.item > a:nth-child(4)')
  carouselItems.forEach((el, i) => {
    el.id = portfolioProjects[i].id
    el.onclick = function () {
      navHandler(this)
    }
  })
  carouselImagesWebp.forEach((el, i) => {
    el.srcset = portfolioProjects[i].imgSrc + '.webp'
  })
  carouselImagesJpeg.forEach((el, i) => {
    el.srcset = portfolioProjects[i].imgSrc + '.jpg'
  })
  carouselImages.forEach((el, i) => {
    el.src = portfolioProjects[i].imgSrc + '.jpg'
    el.alt = portfolioProjects[i].title
  })
  carouselHeadings.forEach((el, i) => {
    el.textContent = portfolioProjects[i].title
  })
  carouselExternalSource.forEach((el, i) => {
    el.href = portfolioProjects[i].projectSourceUrl
  })
  carouselExternalDemosImg.forEach((el, i) => {
    el.href = portfolioProjects[i].projectDemoUrl
  })
  carouselExternalDemos.forEach((el, i) => {
    el.href = portfolioProjects[i].projectDemoUrl
  })
}
portfolio()

function nextPrev(id) {
  const portItemLngth = portfolioProjectsFn().length

  let nextId
  if (id === portItemLngth - 1) nextId = 0
  else nextId = id + 1

  let prevId
  if (id < 1) prevId = portItemLngth - 1
  else prevId = id - 1

  // remove current classes
  document.querySelector('.next').classList.remove('next')
  document.querySelector('.prev').classList.remove('prev')
  document.querySelector('.active').classList.remove('active')

  // add new classes
  document.querySelectorAll('.item')[id].classList.add('active')
  document.querySelectorAll('.item')[nextId].classList.add('next')
  document.querySelectorAll('.item')[prevId].classList.add('prev')
}

function navHandler(event) {
  nextPrev(parseInt(event.id))
}

// redirection page
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

// twin peaks api call
async function getQuote() {
  try {
    let obj
    let response
    // reduce load on twin peaks api during development
    if (window.location.href.match(prodUrl())) {
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

// GitHub repo counter
async function getRepos() {
  try {
    let obj
    let response
    // reduce load on github api during development
    if (window.location.href.match(prodUrl())) {
      response = await fetch('https://api.github.com/users/theDavidBarton')
      await response.json().then(data => (obj = data))
    } else {
      response = '{"public_repos": 20}'
      obj = JSON.parse(response)
    }
    const publicRepos = numberToK(parseInt(obj.public_repos))
    document.querySelector('#ghRepos').textContent = publicRepos
  } catch (e) {
    console.error(e)
  }
}

// GitHub streak scraper
async function getStreak() {
  try {
    let obj
    let response
    // reduce load on my heroku api during development
    if (window.location.href.match(prodUrl())) {
      response = await fetch('https://thedavidbarton.herokuapp.com/api/1/github-streak/theDavidBarton')
      await response.json().then(data => (obj = data))
    } else {
      response = '{"currentStreakCount": 1400}'
      obj = JSON.parse(response)
    }
    const currentStreakCount = numberToK(parseInt(obj.currentStreakCount))
    document.querySelector('#ghStreak').textContent = currentStreakCount
    currentStreakCount == 1
      ? (document.querySelector('#ghStreakSubText').textContent = 'day')
      : (document.querySelector('#ghStreakSubText').textContent = 'days')
  } catch (e) {
    console.error(e)
  }
}

// StackOverFlow reputation
async function getReputation() {
  try {
    let obj
    let response
    // reduce load on github api during development
    if (window.location.href.match(prodUrl())) {
      response = await fetch('https://api.stackexchange.com/2.2/users/12412595?site=stackoverflow')
      await response.json().then(data => (obj = data))
    } else {
      response = '{"items":[{"reputation": 1828}]}'
      obj = JSON.parse(response)
    }
    const reputationOnSO = numberToK(parseInt(obj.items[0].reputation))
    document.querySelector('#soReputation').textContent = reputationOnSO
  } catch (e) {
    console.error(e)
  }
}

// print date
function getDate() {
  const today = new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
  document.querySelector('#funfactDataDate').textContent = today
}
