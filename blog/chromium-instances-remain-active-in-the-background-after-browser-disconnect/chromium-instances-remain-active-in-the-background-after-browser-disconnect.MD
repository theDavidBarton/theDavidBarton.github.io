# Puppeteer: Chromium instances remain active in the background after browser.disconnect

I have a `for...of` loop to visit 3000+ URLs with puppeteer. I use `puppeteer.connect` to `wsEndpoint` so I can reuse one browser instance. I disconnect after each visit and close the tab.

- first 100 URLs `page.goto`'s open the URLs immediately,
- above 100 `page.goto` uses 2-3 retries per URL,
- above 300 `page.goto` uses 5-8 retries per URL,
- above 500 I get `TimeoutError: Navigation timeout of 30000 ms exceeded` all the time.

I checked the Windows Task Manager and I realized hundreds of Chromium instances running in the background and using 80-90MB of memory each and 1-2% of CPU as well.

**Question**

How can I kill the Chromium instances I've already disconnected with `browser.disconnect` for real?

**Example script**

```javascript
const puppeteer = require('puppeteer')
const urlArray = require('./urls.json') // contains 3000+ URLs in an array

async function fn() {
  const browser = await puppeteer.launch({ headless: true })
  const browserWSEndpoint = await browser.wsEndpoint()

  for (const url of urlArray) {
    try {
      const browser2 = await puppeteer.connect({ browserWSEndpoint })
      const page = await browser2.newPage()
      await page.goto(url) // in my original code it's also wrapped in a retry function

      // doing cool things with the DOM

      await page.goto('about:blank') // because of you: https://github.com/puppeteer/puppeteer/issues/1490
      await page.close()
      await browser2.disconnect()
    } catch (e) {
      console.error(e)
    }
  }
  await browser.close()
}
fn()
```

**The error**

The usual puppeteer timeout error.

```bash
TimeoutError: Navigation timeout of 30000 ms exceeded
    at C:\[...]\node_modules\puppeteer\lib\LifecycleWatcher.js:100:111
  -- ASYNC --
    at Frame.<anonymous> (C:\[...]\node_modules\puppeteer\lib\helper.js:94:19)
    at Page.goto (C:\[...]\node_modules\puppeteer\lib\Page.js:476:53)
    at Page.<anonymous> (C:\[...]\node_modules\puppeteer\lib\helper.js:95:27)
    at example (C:\[...]\example.js:13:18)
    at processTicksAndRejections (internal/process/task_queues.js:97:5) {
  name: 'TimeoutError'
}
```

Finally, I was able to achieve the desired result by adding `--single-process` and `--no-zygote` args at launch (+ `--no-sandbox` is required with them).

The number of running Chromium processes isn't growing exponentially anymore, but only two instances remain active: one of them is the usual empty tab in the first position, the second is reused correctly by `puppeteer.connect({ browserWSEndpoint })`.

```javascript
[...]
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--single-process', '--no-zygote', '--no-sandbox']
  })
  const browserWSEndpoint = await browser.wsEndpoint()
[...]
```

- `--single-process`: Runs the renderer and plugins in the same process as the browser [\[source\]][1]

- `--no-zygote`: Disables the use of a zygote process for forking child processes. Instead, child processes will be forked and exec'd directly. Note that --no-sandbox should also be used together with this flag because the sandbox needs the zygote to work. [\[source\]][2]

  [1]: https://peter.sh/experiments/chromium-command-line-switches/#single-process
  [2]: https://peter.sh/experiments/chromium-command-line-switches/#no-zygote
