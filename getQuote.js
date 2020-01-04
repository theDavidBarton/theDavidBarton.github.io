async function getQuote() {
  try {
    const response = await fetch('https://twin-peaks-api.herokuapp.com/api/quotes/recommend')
    const obj = response[0]
    const quoteTextOnly = await obj.quoteTextOnly
    const persons = await obj.persons[0]
    document.querySelector('#twinpeaks-quote > p').textContent = quoteTextOnly
    document.querySelector('#twinpeaks-quote > footer > cite').textContent = persons
  } catch (e) {
    console.error(e)
  }
}
getQuote()
