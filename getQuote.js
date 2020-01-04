async function getQuote() {
  try {
    const response = [
      {
        id: 4,
        quoteText: "Bobby Briggs: Norma, I'll see you in my dreams.\nNorma Jennings: Not if I see you first.",
        quoteTextOnly: "Norma, I'll see you in my dreams.\nNot if I see you first.",
        persons: ['Bobby Briggs', 'Norma Jennings'],
        copyright: {
          license: 'CC-BY-SA 3.0.',
          licenseDetails: 'https://creativecommons.org/licenses/by-sa/3.0/',
          source: 'https://en.wikiquote.org/wiki/Twin_Peaks'
        }
      }
    ] // await fetch('https://twin-peaks-api.herokuapp.com/api/quotes/recommend')
    const obj = response[0]
    const quoteTextOnly = await obj.quoteTextOnly
    const persons = await obj.persons.map(el => el)
    document.querySelector('#twinpeaks-quote > p').textContent = quoteTextOnly
    document.querySelector('#twinpeaks-quote > footer > cite').textContent = persons
  } catch (e) {
    console.error(e)
  }
}
