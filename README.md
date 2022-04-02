![crocodile](https://img.shields.io/badge/crocodiles_in_the_basement-%F0%9F%90%8A_yes-orange.svg)

# theDavidBarton.github.io

My github page and blog.

[Article about redirect page on Medium](https://medium.com/@theDavidBarton/custom-redirect-page-for-a-smooth-transition-between-idling-heroku-dynos-and-fully-functional-apps-8bc7c3346a6a)

# Start development server: localhost:5000

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

## Start dockerized version: localhost:4000

```bash
$ docker build -t thedavidbarton/thedavidbarton-github-io .
# port 5000 is exposed, the page will show a snapshot on localhost:4000
$ docker run -p 4000:5000 -d thedavidbarton/thedavidbarton-github-io
```

_Note:_ 5000 comes from the default port of localhost `npx serve`, see above.

# Static Pre-Rendering of the blog articles

```bash
$ yarn build
$ node ./blog/build-blog.js
```

# Archive

Previous versions of the page are available on Archive.org's [Wayback Machine](https://web.archive.org/web/2020*/thedavidbarton.github.io).

- [2022-03-27](https://web.archive.org/web/20220327062823/https://thedavidbarton.github.io/)
- [2020-08-08](https://web.archive.org/web/20200808181832/thedavidbarton.github.io)
- [2020-11-28[1]](https://web.archive.org/web/20201128103456/thedavidbarton.github.io)
- [2020-11-28[2]](https://web.archive.org/web/20201128104110/thedavidbarton.github.io)
- [2021-01-16](https://web.archive.org/web/20210116164850/https://thedavidbarton.github.io/)
- [2021-01-26](https://web.archive.org/web/20210126212200/https://thedavidbarton.github.io/)
- [2021-02-13](https://web.archive.org/web/20210213135217/https://thedavidbarton.github.io/)
- [2021-02-17](https://web.archive.org/web/20210217111222/https://thedavidbarton.github.io/)
- [2021-03-02](https://web.archive.org/web/20210302171757/https://thedavidbarton.github.io/)

# Copyright

Graphics in the "hobbies" section are downloaded from: [www.fileformat.info](www.fileformat.info). Other icons are from: [simpleicons.org](https://simpleicons.org).

All other graphics and photos of this project have been made available to this project by David Barton and are copyrighted; any other use must be authorized by the maker which holds all the rights for them.

---

MIT License

Copyright (c) 2019-2022 David Barton
