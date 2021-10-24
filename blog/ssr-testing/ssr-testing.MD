# How to test the SSR version of a site (with Puppeteer)?

Maintaining SEO with JavaScript frameworks and libraries such as Angular, React.Js or Vue became a Server-Side Rendering (SSR) challenge in recent years.
Anyway, it was a huge improvement when Googlebot went [evergreen](https://developers.google.com/search/blog/2019/05/the-new-evergreen-googlebot) in 2019, since then it is legit to use Client Side Rendered (CSR) pages while still being SEO-friendly.
I am not destined to decide between the CSR and SSR approaches, you can get better advice from [SEO professionals](https://www.precisdigital.com/blog/the-state-of-javascript-seo-2020/).

What's all the fuss about the SSR version of a site? Well, if we lose a correctly rendered/pre-rendered version of our site our SEO will suffer losses in a short time (search bots will see an empty page while real users still use the client-side rendered pages without problem). It is hard to detect, for example, end-to-end tests will pass as the CSR version can be still perfect and hides the lack of the SSR version from the initial state.
In this post, I will give an example of how to make sure that your dynamic page hasn't lost its SSR (or pre-rendered) nature. The user story is: _As an SEO professional I want to make sure our Dev Team doesn't screw up the SSR version of the site so that we won't flush our business down the toilet_ (e.g.: the pages become fully CSR, SSR has no content, SSR has wrong content, etc.)

## That's the way

😉 We have a site that uses Angular SSR, its `<body>` looks like this:

```html
<body>
  <angular-shell>
    <angular-header>SSR header</angular-header>
    <angular-content>SSR content</angular-content>
    <angular-footer>SSR footer</angular-footer>
  </angular-shell>
  <noscript>
    <b><i>This website requires JavaScript.</i></b>
  </noscript>
  <script src="custom-elements-es5-polyfills.js" nomodule=""></script>
  <script src="runtime-es2017.123456789.js" type="module"></script>
</body>
```

😱 We want to avoid this happening:

```html
<body>
  <angular-shell></angular-shell>
  <noscript>
    <b><i>This website requires JavaScript.</i></b>
  </noscript>
  <script src="custom-elements-es5-polyfills.js" nomodule=""></script>
  <script src="runtime-es2017.123456789.js" type="module"></script>
</body>
```

We can use [`page.setJavaScriptEnabled(enabled)`](https://pptr.dev/#?product=Puppeteer&show=api-pagesetjavascriptenabledenabled) with a `true|false` parameter to disable JavaScript execution (it will take full effect on the next navigation). (By the way, it can be checked with [`page.isJavaScriptEnabled()`](https://pptr.dev/#?product=Puppeteer&show=api-pageisjavascriptenabled) later on.)

Dependending on the Angular app we need to determine when our SSR misbehaves. In this example we can say, the SSR is screwed up if:

- the `<angular-shell>` root component is totally empty (`innerHTML === ''`)
- it doesn't contain mandatory components such as `<angular-header>`, `<angular-content>` etc. (`childElementCount < 1`)

```js
await page.setJavaScriptEnabled(false)
await page.goto(ssrSiteUrl, { waitUntil: 'domcontentloaded' })
const content = await page.$eval('angular-shell', el => el.innerHTML)
const childCount = await page.$eval('angular-shell', el => el.childElementCount)

expect(content).not.toBe('')
expect(childCount).toBeGreaterThan(0)

// don't forget to re-enable it if your test continues
await page.setJavaScriptEnabled(true)
await page.goto(...)
```
