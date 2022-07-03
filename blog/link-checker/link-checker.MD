# Creating a link checker with puppeteer

I use Node's HTTP/HTTPS modules to get the status codes of links within a page. For a current project I implemented it in [puppeteer](https://pptr.dev/) just for fun (actually because of a limitation within the project to use the HTTPS module). Here is the full gist:

```js
const responses = {
  200: [],
  404: []
}
const hrefs = await page.$$eval('a', links => links.map(l => l.href))
for (const href of hrefs) {
  try {
    const crossLinkPage = await browser.newPage()
    await crossLinkPage.setUserAgent('my puppeteer link checker')
    const response = await Promise.race([
      crossLinkPage.goto(href),
      crossLinkPage.waitForResponse(response => response.url() === href && response.status() > 99)
    ])
    const statusCode = response.status()
    await crossLinkPage.close()
    if (responses[statusCode]) {
      responses[statusCode].push(href)
    } else {
      responses[statusCode] = []
      responses[statusCode].push(href)
    }
  } catch (e) {
    console.error(e)
  }
}
```

But the TL;DR part is:

```js
const response = await Promise.race([
  crossLinkPage.goto(href),
  crossLinkPage.waitForResponse(response => response.url() === href && response.status() > 99)
])
const statusCode = response.status()
```

Using puppeteer as link checker is already an expensive choice - I don't recommend it for more than 1-200 links on a page - so I tried to reduce some network usage and speed up page load as much as possible. To avoid the strict rules puppeteer follows to consider a page loaded in `page.goto` I use a `Promise.race` between `goto` and `page.waitForResponse`. The latter will listen to the current link among the network requests (that will be the main document) and once it has a a status code (`> 99` as the [smallest status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) possible would be "100") we can proceed and save it as the final status code.

It is not the fastest solution out there but if you also need a solution purely in puppeteer you can get some inspiration from the above code.

Happy coding!
