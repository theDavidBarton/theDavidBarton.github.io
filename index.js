async function getQuote() {
  try {
    let obj
    let response
    // reduce load on twin peaks api during development
    if (window.location.href.match(/https:\/\/thedavidbarton\.github\.io\//gi)) {
      response = await fetch('https://twin-peaks-api.herokuapp.com/api/quotes/recommend')
      await response.json().then(function(data) {
        obj = data[0]
      })
    } else {
      response =
        '[{"quoteTextOnly":"[DEV MODE] The owls are not what they seem.","persons":["The Giant","Person Name"]}]'
      obj = JSON.parse(response)[0]
    }

    let quoteTextOnly = obj.quoteTextOnly.replace(
      /bitch|fuck|shit|whore|cunt|titties/gi, // some censorship on frequent naughty words in the quotes
      '<span class="bg-secondary">[obscenity]</span>'
    )
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
