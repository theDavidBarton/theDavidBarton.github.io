async function getQuote() {
  try {
    let obj
    const response = await fetch('https://twin-peaks-api.herokuapp.com/api/quotes/recommend')
    await response.json().then(function(data) {
      obj = data[0]
    })
    const quoteTextOnly = await obj.quoteTextOnly
    const persons = await obj.persons.map(el => el)
    document.querySelector('#twinpeaks-quote > p').textContent = quoteTextOnly
    document.querySelector('#twinpeaks-quote > footer > cite').textContent = persons
  } catch (e) {
    console.error(e)
  }
}
