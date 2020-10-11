# Chrome DevTools: `$(selector)` shorthand doesn't return the element while `$$(selector)[0]` does

Time to time I face a weird phenomenon with the `$` chrome api shorthand for `document.querySelector` that it doesn't return the element with the correct selector, while it works correctly with `$$`. As [puppeteer][1] heavily depends on these shorthands (`page.$`, `page.$$`, `page.$eval`, `page.$$eval`) it can cause unexpected issues.

The issue can be even reproduced here, on Stack Overflow at the moment (09-29-2020).

**E.g.:**

- `$('h1').innerText` => `undefined`
- `$$('h1')[0].innerText` => `Chrome DevTools: $(selector) shorthand doesn't return the element...`

![](/img/blog/devtools-dollar-shorthand-jquery-01.png)

**What is its cause, and why the workaround with `$$` works?**

[1]: https://github.com/puppeteer/puppeteer
[2]: https://i.stack.imgur.com/CWpUc.png

I've found it affects those pages that uses jQuery library on their frontend (Stack Overflow uses it at the moment).

On such pages the `$` is occupied by jQuery (as alias for itself), so chrome api returns an object instead of the element for `$(selector)`. The first element is the DOM element itself, that's why `[0]` works.

By the way: `$$(selector)[0]` can be even replaced with `$(selector)[0]`, as this problem has nothing to do with `querySelector` vs. `querySelectorAll`.

**Page using jQuery:**

`$('h1')`:

```markup
n.fn.init(2) [h1.grid--cell.fs-headline1.fl1.ow-break-word.mb8, h1#feed-modal-title.s-modal--header.fw-bold.js-first-tabbable.c-move, prevObject: n.fn.init(1), context: document, selector: "h1"]
```

`$('h1')[0]` / `document.querySelector('h1')`:

```html
<h1>...</h1>
```

![](/img/blog/devtools-dollar-shorthand-jquery-02.png)

**Page _doesn't_ use jQuery:**

...while on pages doesn't rely on jQuery it works as usual.

`$('h1')` / `document.querySelector('h1')`:

```html
<h1>...</h1>
```

`$('h1')[0]`:

```markup
undefined
```

![](/img/blog/devtools-dollar-shorthand-jquery-03.png)

It might be useful for others.

[3]: https://i.stack.imgur.com/jGdhu.png
[4]: https://i.stack.imgur.com/sGh2n.png
