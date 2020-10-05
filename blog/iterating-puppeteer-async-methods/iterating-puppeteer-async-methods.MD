# Iterating puppeteer async methods in `for` loop vs. `Array.map()/Array.forEach()`

As all puppeteer methods are asynchronous it doesn't matter how we iterate over them. I've made a comparison and a rating of the most commonly recommended and used options.

For this purpose, I have created a React.Js example page with a lot of React buttons [here](https://thedavidbarton.github.io/react-examples/#/lot-of-react-buttons) (I just call it _Lot Of React Buttons_). Here **(1)** we are able set how many buttons to be rendered on the page; **(2)** we can activate the black buttons to turn green by clicking on them. I consider it an identical use case as the OP's, and it is also a general case of browser automation (we expect something to happen if we do something on the page).
Let's say our use case is:

```gherkin
Scenario outline: click all the buttons with the same selector
  Given I have <no.> black buttons on the page
  When I click on all of them
  Then I should have <no.> green buttons on the page
```

There is a conservative and a rather extreme scenario. To click **`no. = 132`** buttons is not a huge CPU task, **`no. = 1320`** can take a bit of time.

---

## I. Array.map

In general, if we only want to perform async methods like [`elementHandle.click`](https://pptr.dev/#?product=Puppeteer&version=v4.0.1&show=api-elementhandleclickoptions) in iteration, but we don't want to return a new array: it is a bad practice to use `Array.map`. Map() execution is going to finish before all the iteratees are executed completely because Array iteration methods execute the iteratees synchronously, but these iteratees are asynchronous.

### Code example

```javascript
const elHandleArray = await page.$$('button')

elHandleArray.map(async el => {
  await el.click()
})

await page.screenshot({ path: 'clicks_map.png' })
await browser.close()
```

### Specialties

- returns another array
- parallel execution inside the .map method
- fast

### 132 buttons scenario result: ❌

Duration: 891 ms

By watching the browser in headful mode it looks like it works, but if we check when the `page.screenshot` happened: we can see the clicks were still in progress. It is due to the fact the `Array.map` cannot be awaited by default. It is only luck that the script had enough time to resolve all clicks on all elements until the browser was not closed.

<img src="/img/blog/iterating-puppeteer-async-methods-01.gif" alt="running map" width="450"/><img src="/img/blog/iterating-puppeteer-async-methods-01.png" alt="result map" width="450"/>

### 1320 buttons scenario result: ❌

Duration: 6868 ms

If we increase the number of elements of the same selector we will run into the following error:
`UnhandledPromiseRejectionWarning: Error: Node is either not visible or not an HTMLElement`, because we already reached `await page.screenshot()` and `await browser.close()`: the async clicks are still in progress while the browser is already closed.

---

## II. Array.forEach

All the iteratees will be executed, but forEach() is going to return before all of them finish execution, which is not the desirable behavior in many cases with async functions. In terms of puppeteer it is a very similar case to `Array.map`, except: for `Array.forEach` does not return a new array.

### Code example

```javascript
const elHandleArray = await page.$$('button')

elHandleArray.forEach(async el => {
  await element.click()
})

await page.screenshot({ path: 'clicks_foreach.png' })
await browser.close()
```

### Specialties

- parallel execution inside the .forEach method
- fast

### 132 buttons scenario result: ❌

Duration: 1058 ms

By watching the browser in headful mode it looks like it works, but if we check when the `page.screenshot` happened: we can see the clicks were still in progress.

<img src="/img/blog/iterating-puppeteer-async-methods-02.gif" alt="running foreach" width="450"/><img src="/img/blog/iterating-puppeteer-async-methods-02.png" alt="result foreach" width="450"/>

### 1320 buttons scenario result: ❌

Duration: 5111 ms

If we increase the number of elements with the same selector we will run into the following error:
`UnhandledPromiseRejectionWarning: Error: Node is either not visible or not an HTMLElement`, because we already reached `await page.screenshot()` and `await browser.close()`: the async clicks are still in progress while the browser is already closed.

---

## III. page.\$\$eval + forEach

The best performing solution is a slightly modified version of _bside_'s [answer](https://stackoverflow.com/a/54712599/12412595). The **page.\$\$eval** ([`page.$$eval(selector, pageFunction[, ...args])`](https://pptr.dev/#?product=Puppeteer&version=v4.0.1&show=api-pageevalselector-pagefunction-args)) runs `Array.from(document.querySelectorAll(selector))` within the page and passes it as the first argument to `pageFunction`. It functions as a wrapper over forEach hence it can be awaited perfectly.

### Code example

```javascript
await page.$$eval('button', elHandles => elHandles.forEach(el => el.click()))

await page.screenshot({ path: 'clicks_eval_foreach.png' })
await browser.close()
```

### Specialties

- no side-effects of using async puppeteer method inside a forEach loop
- parallel execution inside the .forEach method
- extremely fast

### 132 buttons scenario result: ✔

Duration: 711 ms

By watching the browser in headful mode we see the effect is immediate, also the screenshot is taken only after every element has been clicked, every promise has been resolved.

<img src="/img/blog/iterating-puppeteer-async-methods-03.gif" alt="running eval foreach" width="450"/><img src="/img/blog/iterating-puppeteer-async-methods-03.png" alt="result eval foreach" width="450"/>

### 1320 buttons scenario result: ✔

Duration: 3445 ms

Works just like in case of 132 buttons, extremely fast.

---

## IV. for...of loop

The simplest option, not that fast and executed in sequence. The script won't go to `page.screenshot` until the loop is not finished.

### Code example

```javascript
const elHandleArray = await page.$$('button')

for (const el of elHandleArray) {
  await el.click()
}

await page.screenshot({ path: 'clicks_for_of.png' })
await browser.close()
```

### Specialties

- async behavior works as expected by the first sight
- execution in sequence inside the loop
- slow

### 132 buttons scenario result: ✔

Duration: 2957 ms

By watching the browser in headful mode we can see the page clicks are happening in strict order, also the screenshot is taken only after every element has been clicked.

<img src="/img/blog/iterating-puppeteer-async-methods-04.gif" alt="running forof" width="450"/><img src="/img/blog/iterating-puppeteer-async-methods-04.png" alt="result forof" width="450"/>

### 1320 buttons scenario result: ✔

Duration: 25 396 ms

Works just like in case of 132 buttons (but it takes more time).

---

# Summary

- Avoid using `Array.map` if you only want to perform async events and you aren't using the returned array, use forEach or for-of instead. ❌
- `Array.forEach` is an option, but you need to wrap it so the next async method only starts after all promises are resolved inside the forEach. ❌
- Combine `Array.forEach` with `$$eval` for best performance if the order of async events doesn't matter inside the iteration. ✔
- Use a `for`/`for...of` loop if speed is not vital and if the order of the async events does matter inside the iteration. ✔

---

# Sources / Recommended materials

- [Sebastien Chopin: _JavaScript: async/await with forEach()_ (codeburst.io)](https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404)
- [Antonio Val: _Making array iteration easy when using async/await_ (Medium)](https://medium.com/@antonioval/making-array-iteration-easy-when-using-async-await-6315c3225838)
- [_Using async/await with a forEach loop_ (Stackoverflow)](https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)
- [_Await with array foreach containing async await_ (Stackoverflow)](https://stackoverflow.com/questions/51738684/await-with-array-foreach-containing-async-await)
