# Testing against multiple browser versions in 2021

A [great question](https://stackoverflow.com/questions/67033300/whats-the-benefit-of-e2e-testing-only-against-latest-browser-versions/) came up today on Stack Overflow from user [zanona](https://stackoverflow.com/users/165750/zanona). It is indeed a very elementary question and gets more relevant each year. 

> What's the benefit of E2E testing only against latest browser versions? [...]
>
> Any insights about why considering only recent browser versions and forgetting about the rest is a good idea, by using Playwright instead of a tool which would allow targeting tests against a specific browser binary[?]

I was consistent about using the latest Chromium-based browsers in my end-to-end tests in the past years, still it is a very valid assumption to run our tests on as many browser versions as possible for wider support of our product.

Do you remember Browsershots.org with its long list of specific navigators?

![Browsershots.org](/img/blog/e2e-different-browser-versions-02.png)

Those days are gone as the way how browsers are updated changed over time.

Well of course, as always browser version usage really depends on our needs. Let's see.

## Puppeteer, Playwright with specific executable

First, let's clarify that it is possible to launch Puppeteer and Playwright with other executables than the bundled one in the case of Chrome/Chromium.

**Puppeteer:** [`puppeteer.launch([options])`](https://pptr.dev/#?product=Puppeteer&show=api-puppeteerlaunchoptions)

```js
const browser = await puppeteer.launch({ executablePath: '/path/to/Chrome70' });
```
**Playwright:** [`browserType.launch([options])`](https://playwright.dev/docs/api/class-browsertype?_highlight=launch#browsertypelaunchoptions)

```js
const browser = await chromium.launch({ executablePath: '/path/to/Chrome70' });
```

Second, even if 'testing' is there in the list of features in the case of [Puppeteer](https://github.com/puppeteer/puppeteer#what-can-i-do) and [Playwright](https://github.com/microsoft/playwright#documentation--api-reference), they are not testing frameworks like [Cypress which is a testing tool](https://docs.cypress.io/guides/overview/why-cypress#In-a-nutshell) primarily. 

---

## What's the benefit of E2E testing only against the latest browser versions?

Some years ago it was crucial to test across all browsers and as many versions as used by a mass of users.  
Over time it has changed.

### What's new in 2021?
- Only **Google Chrome** and **Safari** (Webkit) browsers have 10%+ market share. [Statcounter.com](https://gs.statcounter.com/browser-market-share), [Wikpedia](https://en.wikipedia.org/wiki/Usage_share_of_web_browsers)
- For the vast majority not even Firefox support is required (with its [3.68% market share](https://gs.statcounter.com/) worldwide)
- "Google Chrome on Windows and Mac **auto-updates itself** on a regular basis. The auto-updating procedure is performed by Google Update, which is based on the open-source Omaha project. Auto-updated provides fixes to sometimes critical issues, limiting exposure." [chromium.org](https://www.chromium.org/administrators/turning-off-auto-updates)
- Due to the auto-updates the number of users with not the latest Chrome is very marginal. The previous versions (e.g. the last-but-one) go out of circulation in 1-2 months and remains under 1% share for a short time before vanishing. [Desktop Browser Version Market Share Worldwide, Statcounter.com](https://gs.statcounter.com/browser-version-market-share/desktop/worldwide/)

![Desktop Browser Version Market Share Worldwide](/img/blog/e2e-different-browser-versions-01.png)

### Conclusion(s)

I.) **It means for most products it is fairly enough and the best option to test against the latest browser versions.**




For example Chrome 70 is a relatively old version, [released in October 2018](https://developer.chrome.com/blog/new-in-chrome-70/), for most products it is not required to support it, they are in the same bucket as [Internet Explorer 11 or legacy Edge](https://www.theverge.com/2020/8/17/21372487/microsoft-internet-explorer-11-support-end-365-legacy-edge).

II.) For some products, you may have to support specific (older) browser versions, in that case, the usage of specific executables can help.

By the way, if you'd decide to run tests against multiple browser versions it will be still possible with Puppeteer or Playwright as well, you just need to provide the right executables while the test suites are iterated over (e.g. in case of Jest: [`describe.each()`](https://stackoverflow.com/questions/57504927/how-to-add-types-for-jest-test-with-describe-each) can run the same tests or test suites with different configs and test data).
