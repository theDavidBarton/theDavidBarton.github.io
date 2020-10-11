# Custom redirect page for a smooth transition between idling Heroku dynos and fully functional apps

To host my Node/React projects I am using a Free plan on Heroku which has its limitations. The most challenging one is the limited time these dynos are available.

[What Heroku dynos are?](https://www.heroku.com/dynos) At Heroku the virtual containers are called dynos, your app will run on one or more of these depending on your monthly plan and scaling of your app. In the Free plan, you will have only one dyno per app, which will go to sleep after 30 minutes of inactivity (lack of visitors on your app).

I know that their Hobby plan would be more accurate for my projects and it still has a reasonable price (a Hobby dyno is [7\$/month](https://www.heroku.com/dynos) currently), but as I don’t have frequent visitors on my web apps I decided to stay with the Free plan.

The only annoying thing is — from user & UX point of view — when your dyno went to sleep after the 30 minutes of inactivity it will take time for them to wake up when the next visitor arrives (multiple _yarn starts_ on a relatively slow dyno), it takes around 6–7 seconds to get the [First Meaningful Paint](https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint).

I said annoying because it is literally a white screen without any preloader or note about _Heroku is warming up/dyno is waking up/soon the page will load_ etc. Nothing, so a new user won’t wait for this 6–7 secs, will think my app is broken and leaves before it would be rendered.

_(Did you know? You can keep awake a dyno by pinging your Heroku app at least once per 30 minutes. It can be nicely done with a free [New Relic monitor](https://coderwall.com/p/u0x3nw/avoid-heroku-idling-with-new-relic-pings). However, the current article will show you a different approach to deal with Heroku idling.)_

As I decided to keep the Free plan and live for a while with the blank white screens, I realized there is a solution to entertain and inform the users until they get the fully-loaded app.

## TL;DR

**I created an old fashioned redirect page as a bridge (preloader) between my page and my Heroku apps.** Redirection pages are entities I don’t like on other sites, however, it just fills the gap nicely, hides the blank white page totally (see the last section) and it is fun to create one. Last but not least if you can put creativity into its design it will be nice enough not to annoy your users at all (pro tip: don’t put ads on it).

You can make a nice CSS loading animation as well in a preloader style as the content, as long as it is clear enough for the user why it appears for some secs before the app would be loaded.

I created it simply in **(1) HTML,** **(2) vanilla JavaScript, (3) Bootstrap 4 **and **(4) Gimp**. Feel free to adopt it with more today’s technologies.

**Ingredients:**

1.  An **existing page** we own (e.g. our _GitHub Pages_ page) and where from we can redirect the users to the Heroku apps;

2.  A **redirect.html** file on the page;

3.  Inside <head> an **http-equiv=”refresh”** meta tag;

4.  A **nice content** which will be visible for the users until the Heroku dyno pull oneself together (text/image);

5.  An **url parameter**, carrying the herokupapp’s url we want to redirect to;

6.  A **JavaScript function** to dynamically recognize and replace the value of the parameter in the meta tag from step 3.;

7.  An **array of trusted links** we accept for our redirection.

## Have your own page

You need one if you want to redirect users. Did you know if you put an index.html on a GitHub repo which has your **<username>.github.io** name it will be automatically deployed to this GitHub Pages domain? It can be even a bundled React/Angular app’s public folder. In my case, it is plain HTML, JS and CSS files.

## Create the redirection page

As I mentioned mine is a bit old fashioned, I just created such an HTML file and styled it to be similar to my homepage (used Bootstrap 4 and some custom CSS to override default Bootstrap styles).

The key of the redirection is this meta tag: **http-equiv="refresh"** (this is the default value, we gonna update its content with JavaScript later):

```html
<meta id="refresh" http-equiv="refresh" content="7; URL='https://theDavidBarton.github.io/'" />
```

Assign id=”refresh” to it.

**content:**

- 7 = Seven seconds until redirection (page refresh), it is just a default value we gonna set to “0” later: important not to set zero secs here by default as it would prevent JavaScript from making the magic;

- URL = the desired _window.location.href_ (by default it can be your homepage).

The HTML source of **redirect.html **looks something like this (just imagine the parts with […] or check it out in my GitHub repo linked at the end of this article):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    [...]
    <meta id="refresh" http-equiv="refresh" content="7; URL='https://theDavidBarton.github.io/'" />
  </head>
  <body>
    <script src="index.js" onload="getUrlFromLink()"></script>
    [...]
    <section class="row text-center">
      <div class="col my-4">
        <h1>This dyno* might be sleeping!</h1>
        <img height="250" src="img/dino.png" alt="sleeping dino" />
        <p>
          Please be patient after the redirection for <strong>6-7 seconds</strong> you may need to wait.<br />If you'd face a
          blank page: worry not! It will turn into something very nice soon^^.
        </p>
        <small
          >*dynos are the containers at<a href="https://www.heroku.com/dynos" target="_blank" rel="noopener noreferrer">Heroku</a
          >, free ones go to sleep after a certain time</small
        >
      </div>
    </section>
    <div class="row text-center">
      <div class="col my-4">
        <a href="/"><button class="btn btn-dark">✋ stop redirection</button></a>
      </div>
    </div>
    [...]
  </body>
</html>
```

## Content

The key idea behind my solution is to entertain the user until he/she waits for the Heroku app to be awakened in the background, so it worths to think of something unique, something nice. I created a drawing of a sleeping dino (get it!? dyno = dino! :DDD …sorry! :\$ ) in Gimp and I wrote a short explanation section about **why** this redirection and **Intermission scene** is happening.

**It goes like this:**

![](/img/blog/idling-heroku-01.png)

_This dyno_ might be sleeping!\*

_Please be patient after the redirection for **6–7 seconds **you may need to wait.
If you’d face a blank page: worry not! It will turn into something very nice soon^^._

\*_dynos are the containers at [Heroku](https://www.heroku.com/dynos), free ones go to sleep after a certain time_

I also added a “stop redirection” button on the bottom in case someone would cancel the process. But it is an optional element.

## URL parameter

It will be “url” (**?url=**…). It can be anything that semantically fits your needs.

## JavaScript

Super simple implementation: with Regex we retrieve the value of the “url” parameter with the **getUrlFromLink** function.

The most important part updates the meta tag’s content (the meta has its own HTML id: #refresh):

```javascript
document.querySelector('#refresh').content = `0; URL='${url}'`
```

**Zero seconds will be the time until redirection (page refresh). It means: (1) in case the dyno is available redirect will be immediate to the Heroku app, (2) while if it sleeps users will spend a maximum of 6–7 seconds on the redirect page then the Heroku app will be opened without any flash of white screen.**

There is no other functionality nor extra error handling here, as we will parameterize the redirect links ourselves the business logic is restricted to recognize this single parameter properly. The only extra I have added is a **trustedLinks** array. It needs to be maintained manually (at least in my example), but with its help, no funny folks will use your redirection page to steal your s̶u̶n̶s̶h̶i̶n̶e̶ SEO by putting XXX links and other funny stuff in the url parameter.

My JavaScript looks like this:

```javascript
'use strict'

const trustedLinks = ['https://my-first.herokuapp.com/', 'https://my-second.herokuapp.com/', 'https://my-third.herokuapp.com/']

function getUrlFromLink() {
  const urlSelector = window.location.href.match(/url(.*)/)[0]
  const url = urlSelector.replace('url=', '')
  if (trustedLinks.includes(url)) {
    document.querySelector('#refresh').content = `0; URL='${url}'`
  }
}
```

## The Result

A similar redirect page is the result of https://<username>.github.io/redirect.html**?url=[https://my-first.herokuapp.com/](https://trending-video-games.herokuapp.com/)**. You can replace all the Heroku app links on your page with these links.

+You can use the redirection even from your social media if you create a [Bitly shortened link](https://bitly.com/) for the redirection url, it won’t be confusing if you are sharing your Heroku app like this (while the parametized long url might be).

![](/img/blog/idling-heroku-02.png)

## And do you know what is the best part?

… I might wrote:

> If you’d face **a blank page**: worry not! It will turn into something very nice soon^^.

…but **the users will never see that blank page.** If the dyno is indeed sleeping: they will see this redirect page for max. 7 seconds (seven is the calculated delay of warming up / _yarn start_ of the actual Heroku app).

It gives a much more smooth experience than the regular redirection with the blank page for 7 seconds we had previously.

_Note:_ this redirection is not a standard HTTP redirect right now but an HTTP 200, it would require a backend functionality to make it an HTTP 301 ( Moved Permanently) or 303 ( See Other). For the current purpose, it is OK like this.

You can check out my full implementation on [GitHub](https://github.com/theDavidBarton/theDavidBarton.github.io).

**_Update:_** since this article was written I replaced dino by a preloader CSS animation. [See more…](https://medium.com/@theDavidBarton/simple-preloader-css-animation-72dfcdb443d7)
[**theDavidBarton/theDavidBarton.github.io**](https://github.com/theDavidBarton/theDavidBarton.github.io)
[**Simple preloader CSS animation**](https://medium.com/@theDavidBarton/simple-preloader-css-animation-72dfcdb443d7)
