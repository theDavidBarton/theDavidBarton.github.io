# Simple preloader CSS animation

Previously I was working on a redirect page to act as a bridge between my page and my idling Heroku apps. The next step is to make the content of this redirect page a bit more elegant.
[**Custom redirect page for a smooth transition between idling Heroku dynos and fully functional apps**
*I am using a Free plan on Heroku to host my Node/React projects which has its limitations. The most challenging one is…*medium.com](https://medium.com/@theDavidBarton/custom-redirect-page-for-a-smooth-transition-between-idling-heroku-dynos-and-fully-functional-apps-8bc7c3346a6a)

Though I really liked the sleeping dino and the text content explains why the user sees the redirection, an animation is much more elegant, and in case of non-idling Heroku app, it is less redundant (if the redirection flashes for only a second it is confusing for the user as he/she cannot process the written info nor the graphic).

I decided to use my logo and a “loading…” text as the preloader on the animation.

About the functionality of the redirection page read my [previous article](https://medium.com/@theDavidBarton/custom-redirect-page-for-a-smooth-transition-between-idling-heroku-dynos-and-fully-functional-apps-8bc7c3346a6a).

## CSS

We gonna have an **outer** div and its width will be animated from zero to the size of the logo. In my case it is 300px (set in the <img> too). The animation starts only at 15% of keyframes. I also define an **inner** div that will contain the “unloaded” logo from the beginning. I also store two classes to recolor these logos (called evil-twin [black] and good-twin [white]).

The two logos will be put on top of each other (position: absolute) and the outer one gonna have a higher z-index to make sure the animation is played on top of the black/unloaded logo

The CSS:

    .outer {
      width: 300px;
      overflow: hidden;
      animation: preloader 7s;
    }

    .inner {
      width: 300px;
    }

    .evil-twin {
      filter: brightness(0);
    }

    .good-twin {
      filter: brightness(100);
    }

    @keyframes *preloader* {
      0% {
        width: 0;
      }
      15% {
        width: 0;
      }
      100% {
        width: 300px;
      }
    }

and the HTML (using some Bootstrap 4 classes!):

    [...]
    <div>
      <div class="**outer** position-absolute" style="z-index:5;">
        <div class="**inner**">
          **<img src="img/logo.svg" width="300" alt="branded logo" class="good-twin" />**
          <p class="text-center display-4">loading...</p>
        </div>
      </div>
      <div class="position-absolute">
        **<img src="img/logo.svg" width="300" alt="branded logo" class="evil-twin" />**
        <p class="text-center display-4" style="color:black">loading...</p>
      </div>
    </div>
    [...]

I only needed to fight a bit with positioning it on all devices to the center, this part is not part of the example above.

![](/img/blog/simple-preloader.png)

You can check out the full code in my Github page’s repo:
[**theDavidBarton/theDavidBarton.github.io**
*My GitHub page. Contribute to theDavidBarton/theDavidBarton.github.io development by creating an account on GitHub.*github.com](https://github.com/theDavidBarton/theDavidBarton.github.io)
