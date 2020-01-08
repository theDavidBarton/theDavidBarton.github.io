async function getQuote() {
  try {
    let obj
    let response
    // reduce load on twin peaks api during development
    if (window.location.href.match(/https:\/\/thedavidbarton\.github\.io\//gi)) {
      response = await fetch('https://twin-peaks-api.herokuapp.com/api/quotes/recommend?relevance=1&profanity=false')
      await response.json().then(function(data) {
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
