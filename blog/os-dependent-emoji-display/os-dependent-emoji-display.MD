# OS dependent emoji display

🐊 An emoji looks different to you than to me if we are looking at it on different platforms. Everyone has a preffered set of emojis and it can be disheartening to see that the content we've carefully created has a totally different meaning on another platform, another OS. Let's see what we can do about this phenomenon.

## Emojipedia

[Emojipedia.org](https://emojipedia.org/) is the best quality source about emojis to compare their look among all the emoji libraries. (If you have a strong machine you can also browse them on [unicode.org](https://unicode.org/emoji/charts/full-emoji-list.html) in a truly beautiful, but enormous HTML table)
In case of my favourite one, the `:crocodile:`

🐊: U+1F40A (Unicode code point, registered as _Crocodile_)

...there is even a warning on the site that says:

```bash
🚩 Appearance differs greatly cross-platform. Use with caution.
```

...and it seems they are not joking!

![A croc on different systems](/img/blog/os-dependent-emoji-display-01.png)
_A croc on different systems_

The biggest emoji libraries (mostly based on Unicode) are:
- **Apple** (iOS, Macintosh)
- **Google** (Android)
- **Samsung** (Android)
- **Microsoft** (Windows)
- WhatsApp
- Twitter
- Facebook
- JoyPixels
- OpenMoji
- emojidex
- Messenger (discontinued)
- LG (Android) (discontinued)
- HTC (Android) (discontinued)
- Mozilla (Firefox OS) (abandoned)

I marked the most relevant ones which could come up in web usage. The others are used in specific native apps or already discontinued or abbandoned.

The reason behind why they differ so much is simple: emojis are copyright protected by default (anyway many of the listed libraries has open licenses) so each producer/company creates their own custom sets of these symbols.

## Hack the difference

As forcing the usage of a symbol among all OS-s (e.g. vectorizing an emoji of a specific library) requires copyright procedure you can create fallbacks for the bigger platforms. `navigator.platform` will return the a string which helps identifying the OS (note: it is not 100% precise, see the links at the bottom of the post), using Emojipedia you can collect the emojis you want to show for viewers per a specific platforms. Then you can set conditionally the emoji content, for example _"the 👱🏻‍♂️ looks OK in the Apple library, but on Android the 😺 is more suitable for my needs..."_ etc.

E.g.:

```javascript
const platform = window.navigator.platform

const firstElem = document.querySelector('#first')
const secondElem = document.querySelector('#second')
const thirdElem = document.querySelector('#third')

// Apple
if (platform.match(/iPhone|iPad|iPod|Mac/i)) { 
  firstElem.innerText = '👱🏻‍♂️'
  secondElem.innerText = '⚗️'
  thirdElem.innerText = '📝'
// mostly: Google or Samsung
} else if (platform.match(/Linux|Android/i)) { 
  firstElem.innerText = '😺'
  secondElem.innerText = '🍼'
  thirdElem.innerText = '🧻'
// Microsoft
} else if (platform.match(/Win/i)) { 
  firstElem.innerText = '😬'
  secondElem.innerText = '🍾'
  thirdElem.innerText = '📜'
// fallbacks
} else { 
  firstElem.innerText = '#'
  secondElem.innerText = '{ };'
  thirdElem.innerText = '/**/'
}
```

Also note: the [results may vary](https://www.youtube.com/watch?v=OUmU7paCZnM) between different versions of the same OS/emoji library.

![A croc on the same system's different versions](/img/blog/os-dependent-emoji-display-02.png)
_A croc on the same system's different versions_

It is indeed a srange aspect of the web, if you want to know more I can recommend the following sources:

## Useful sources:
- https://emojipedia.org/
- https://unicode.org/emoji/charts/full-emoji-list.html
- https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
- https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/platform

🐊🐻✨🔥🥺🍔

Emojis are fun!
