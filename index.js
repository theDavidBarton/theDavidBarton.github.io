async function getQuote() {
  try {
    let obj
    let response
    // reduce load on twin peaks api during development
    if (window.location.href.match(/https:\/\/thedavidbarton.github.io\//gi)) {
      response = await fetch('https://twin-peaks-api.herokuapp.com/api/quotes/recommend')
      await response.json().then(function(data) {
        obj = data[0]
      })
    } else {
      response =
        '[{"quoteTextOnly":"[DEV MODE] The owls are not what they seem.","persons":["The Giant","Person Name"]}]'
      obj = JSON.parse(response)[0]
    }

    const quoteTextOnly = await obj.quoteTextOnly
    const persons = await obj.persons.map(el => el)
    document.querySelector('#twinpeaks-quote > p').textContent = quoteTextOnly
    document.querySelector('#twinpeaks-quote > footer > cite').textContent = persons
  } catch (e) {
    console.error(e)
  }
}
