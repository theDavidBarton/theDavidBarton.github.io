![crocodile](https://img.shields.io/badge/crocodiles_in_the_basement-%F0%9F%90%8A_yes-orange.svg)

# theDavidBarton.github.io

My github page.

[Article about redirect page on Medium](https://medium.com/@theDavidBarton/custom-redirect-page-for-a-smooth-transition-between-idling-heroku-dynos-and-fully-functional-apps-8bc7c3346a6a)

# Start development server

```bash
$ npx serve

   ┌────────────────────────────────────────────────┐
   │                                                │
   │   Serving!                                     │
   │                                                │
   │   - Local:            http://localhost:5000    │
   │   - On Your Network:  http://0.0.0.0:5000      │
   │                                                │
   └────────────────────────────────────────────────┘

```

Bon appétit !

## Start dockerized version

```bash
$ docker build -t thedavidbarton/thedavidbarton-github-io .
# port 5000 is exposed, the page will show a snapshot on localhost:4000
$ docker run -p 4000:5000 -d thedavidbarton/thedavidbarton-github-io
```
_Note:_ 5000 comes from the default port of `npx serve`, see above.

# Static Pre-Rendering of the blog articles

```bash
$ yarn build
$ node ./blog/build-blog.js
```

# Credits

**Design inspiration for this site** (especially the top bar and the rich emoji usage) from: [flaviocopes.com](https://flaviocopes.com/) 🙏.

# Archive

Previous versions of the page are available on Archive.org's [Wayback Machine](https://web.archive.org/web/2020*/thedavidbarton.github.io).

- [2020-08-08](https://web.archive.org/web/20200808181832/thedavidbarton.github.io)
- [2020-11-28[1]](https://web.archive.org/web/20201128103456/thedavidbarton.github.io)
- [2020-11-28[2]](https://web.archive.org/web/20201128104110/thedavidbarton.github.io)

# Copyright

Graphics in the "hobbies" section are downloaded from: [www.fileformat.info](www.fileformat.info). Other icons are from: [simpleicons.org](https://simpleicons.org).

All other graphics and photos of this project have been made available to this project by David Barton and are copyrighted; any other use must be authorized by the maker which holds all the rights for them.

---

MIT License

Copyright (c) 2020 David Barton
