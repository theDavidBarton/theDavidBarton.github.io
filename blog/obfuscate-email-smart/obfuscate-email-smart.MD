# Obfuscate e-mail smart

Let's assume you need to put an e-mail address (or more) on your website and a contact form is not an option (obviously it would be the ultimate obfuscation but) our usecase is to have an `<a>` element with a `mailto:` URL scheme in its `href`.

It is 2021, spam filters at the top e-mail providers are efficient, normally you should not worry to use e-mail addresses in your markup. If you still want some protection from landing in a spam address list you can apply the following trick.

Back in the old days it was enough to put the e-mail address with JavaScript into the href, as bots didn't use JS. E.g.:

```javascript
var provider = '<E-MAIL PROVIDER NAME>'
a.href = 'mailto:theDavidBarton@' + provider + '.com'
```

...did the job.

These crawlers evolved with time, but they are still simple. Though they may see the JS generated content (remember, since May 2019 even [Googlebot is "evergreen"](https://developers.google.com/search/blog/2019/05/the-new-evergreen-googlebot))

### `<FAKE E-MAIL PROVIDER NAME😜>` VS. `<ACTUAL E-MAIL PROVIDER NAME😎>`

Crawlers doing e-mail collection in bulk, you need to make them believe they achieved their purpose and got your address while you are feeding them with a fake e-mail, then you can replace the bait with the actual one for real users. To achive this:

#### steps:

1. **Put the bait address into the markup** to trick crawlers;
2. Write a delayed String.replace() of the actual address, to **make sure real users will face the real** one.

**HTML:**

```html
<a id="mailto" href="mailto:theDavidBarton@<FAKE E-MAIL PROVIDER NAME😜>.com"></a>
```

Three seconds is enough for most crawlers on a page, while it ensures real human will see/click the real e-mail link.

**JS:**

```javascript
const mailtoUpdater = () => {
  const mail = document.querySelector('#mailto')
  window.setTimeout(() => {
    mail.href = mail.href.replace('<FAKE E-MAIL PROVIDER NAME😜>', '<ACTUAL E-MAIL PROVIDER NAME😎>')
  }, 3000)
}
```

### Crawling results

An example how a crawler (written in puppeteer) could look for the e-mail addresses on a page:

```javascript
const aHrefs = await page.$$eval('a', elems => elems.map(el => el.href))
let mailto

for (let href of aHrefs) {
  if (href.includes('mailto:')) {
    console.log(href)
    mailto = href.replace('mailto:', '')
  }
}
```

Even if I played with the `waitUntil` events I still harvested the bait e-mail address string:

| event                      | retrieved string (mailto)                        |
| -------------------------- | ------------------------------------------------ |
| load                       | theDavidBarton@<FAKE E-MAIL PROVIDER NAME😜>.com |
| DOM<wbr>Content<wbr>Loaded | theDavidBarton@<FAKE E-MAIL PROVIDER NAME😜>.com |
| network<wbr>idle2          | theDavidBarton@<FAKE E-MAIL PROVIDER NAME😜>.com |
| netwok<wbr>idle0           | theDavidBarton@<FAKE E-MAIL PROVIDER NAME😜>.com |

![](https://static01.nyt.com/images/2016/08/05/us/05onfire1_xp/05onfire1_xp-superJumbo-v2.jpg)

This is fine.
