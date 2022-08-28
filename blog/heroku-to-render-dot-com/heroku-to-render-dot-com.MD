# How to move React.Js + Node.Js full-stack application from free Heroku dyno to Render.com?


As of 28th November 2022 Heroku [shuts down its Free Dynos](https://blog.heroku.com/next-chapter) and removes every deployment using it. It is bad news for everybody who will run into a tutorial that starts with "Let's create a full-stack web app and deploy it on the fly to Heroku for free". So long tutorial writers.

It has been indeed the best free cloud hosting for hobby projects even if the deployments on the so-called "dynos" idled after inactivity and took 30 seconds to wake up. My own React.Js Node.Js/Express.Js full-stack apps are also affected (see my old blog post about the [Heroku idling topic](/blog/idling-heroku)) so I started to look for a new place where I can deploy small projects within a free plan and I choose [Render.com](https://www.render.com/).


**[Render](https://render.com/)** is a cloud platform for Ruby, Node.js, Python, Rust, Go, and PHP-based applications. with free TLS certificates, global CDN, private networks and auto deploys from Git.  
It provides a similar range of services as Heroku.

Let's see how can we migrate our free Heroku React.Js+Node.Js full-stack applications from Heroku to Render.com.

### preparations

First, visit your Heroku dashboard at https://dashboard.heroku.com/apps. I will migrate [`retro-game-finder`](https://github.com/theDavidBarton/retro-game-finder) in this post. 

![](/img/blog/heroku-to-render-dot-com-01.png)

Select the app and visit its "Deploy" tab. Here you can disconnect it so your merges on `main` branch won't auto-deploy the new changes to Heroku. Like this, you can avoid the following Render-specific changes breaking your Heroku deployment (anyway, they will be deleted latest in November 2022).

![](/img/blog/heroku-to-render-dot-com-02.png)

Now we can go forward to connect the project to Render. Once you've registered to Render.com with your Github profile (it is Free, requires no credit card number, and is not part of the current post but [you can check the Docs](https://render.com/docs/github#log-in-with-github) if you'd be stuck with the signup process) you can configure which repositories to connect with the platform. You can do it on the https://github.com/apps/render/installations/new link. Select your actual Github profile/project and click "Configure". 

![](/img/blog/heroku-to-render-dot-com-03.png)

You can allow Render to connect with all your Github repositories, I select only those I will deploy to this provider. I select [`theDavidBarton/retro-game-finder`](https://github.com/theDavidBarton/retro-game-finder) from the list of repos.

![](/img/blog/heroku-to-render-dot-com-04.png)

## set up backend

On https://dashboard.render.com/ click the "New" button in the top right and select "Web Service" for your Node.Js backend service.

![](/img/blog/heroku-to-render-dot-com-05.png)

Connect to `theDavidBarton/retro-game-finder`.

![](/img/blog/heroku-to-render-dot-com-06.png)

Render will automatically set most of the deployment settings based on your `package.json`. The `Name` will be part of your service URL so name it wisely.

![](/img/blog/heroku-to-render-dot-com-07.png)

You can see it parses the package file correctly:

![](/img/blog/heroku-to-render-dot-com-08.png)

After reviewing the plans at Render you can stay on the Free plan and click "Create Web Service".

![](/img/blog/heroku-to-render-dot-com-09.png)

It starts to deploy the Node.Js backend.

![](/img/blog/heroku-to-render-dot-com-10.png)

At this point, my app did not start on Render with a missing environment variable error. Let's copy the variables from Heroku by selecting the App on https://dashboard.heroku.com/apps and clicking the "settings" tab. They are called "Config Vars" which can be revealed. (You cannot avoid running into this, as the environment variables can be only set once you created the service).

![](/img/blog/heroku-to-render-dot-com-11.png)

Then on render selecting the "Environment" tab below the deployment logs where we have been you can add the environment variables.

![](/img/blog/heroku-to-render-dot-com-12.png)
![](/img/blog/heroku-to-render-dot-com-13.png)

Here you can either manually deploy again the container image with the big purple button above or you can wait until the next Github merge to `main` when it will happen automatically.

![](/img/blog/heroku-to-render-dot-com-14.png)

When the service is restarted/redeployed with the environment variables you can test an endpoint.

![](/img/blog/heroku-to-render-dot-com-15.png)

## set up frontend

All the frontend migration can be seen in this commit (it only includes some minor cleanup and dependency maintenance you can ignore) https://github.com/theDavidBarton/retro-game-finder/commit/17ff1d0629ecf4cd08ef7d34d8fbe840c92a0d31. The most important changes happen in each react.js components that have internal backend calls. E.g.:

When it will be served from Render we should call the backend URL, when we are in localhost we use the proxy from the React package.json which is set to `localhost:5000`, but will be proxied so we don't need to set it, let's keep it as an empty string so it can operate in local as before.
```js
const domain = process.env.NODE_ENV === 'production' ? 'https://retro-game-finder-backend.onrender.com' : '';
```

Will be used in a `useCallback` hook...
```js
const response = await fetch(`${domain}/api/trending`);
```
... that requires `domain` as a dependency:
```js
}, [domain]); 
```

![](/img/blog/heroku-to-render-dot-com-16.png)
![](/img/blog/heroku-to-render-dot-com-17.png)

I also removed from the Node backend (Express.Js) the Heroku-specific routing workarounds.

![](/img/blog/heroku-to-render-dot-com-18.png)

Once we merge the change to `main`...

![](/img/blog/heroku-to-render-dot-com-19.png)

... It starts to deploy the backend which is already connected via Github. 

![](/img/blog/heroku-to-render-dot-com-20.png)

Now let's create a static site with the `/client` directory. Go to the Dashboard once more and click _New > Static Site_.

![](/img/blog/heroku-to-render-dot-com-21.png)

Select again the `retro-game-finder` repo.

![](/img/blog/heroku-to-render-dot-com-22.png)

Here you need to make sure you set:

1. `Name`: that will be the final applications URL base `retro-game-finder-frontend` --> https://retro-game-finder-frontend.onrender.com/
2. `Branch`: automatically set up correctly to `main`
3. `Build Command`: in my case, it needs to step into the `client` folder, install dependencies and finally build a production bundle of the React.Js app. `$ cd client && yarn && yarn run build`
4. `Publish directory`: in most cases, it is called `build`, for me it is located in `client/`.

Click "Create Static Site".

![](/img/blog/heroku-to-render-dot-com-23.png)

It starts to deploy the React.Js frontend.

![](/img/blog/heroku-to-render-dot-com-24.png)

It is important that if you use React Router for routing in a Single Page App then you will need to set specific URL rewrites in the "Redirects/Rewrites" section of the frontend. In the case of _Create React App_ (which I use to bootstrap React.Js apps) they provide these steps on how to set up correctly: https://render.com/docs/deploy-create-react-app.

![](/img/blog/heroku-to-render-dot-com-25.png)

Source Path:	/*  
Destination Path:	/index.html  
Action:	Rewrite  

![](/img/blog/heroku-to-render-dot-com-26.png)

Unfortunately, I am not ready, as I totally forgot about [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) when calling other domains as backend from the client-side. On Heroku, it was not a problem as we are able to deploy both frontend and backend on the same dyno with the same service URL.

![](/img/blog/heroku-to-render-dot-com-27.png)

For this purpose, I install [cors](https://www.npmjs.com/package/cors) npm package.

![](/img/blog/heroku-to-render-dot-com-28.png)
![](/img/blog/heroku-to-render-dot-com-29.png)

In the Node backend, I add the URL of the frontend as Allow Access Control Origin.

```js
app.use(cors({ origin: 'https://retro-game-finder-frontend.onrender.com' }));
```

![](/img/blog/heroku-to-render-dot-com-30.png)

Once I pushed the fix on Github (https://github.com/theDavidBarton/retro-game-finder/commit/730cce725aa389aee89accefc4c7b1b1df10f1e0) we need to wait a few seconds for Render to redeploy the new backend version which includes the correct response header so we have no CORS error:

![](/img/blog/heroku-to-render-dot-com-31.png)


That's all. It is available and working nicely at https://retro-game-finder-frontend.onrender.com/.