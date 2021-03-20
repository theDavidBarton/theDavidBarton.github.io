'use strict';

// redirection page
document.addEventListener('DOMContentLoaded', () => {
  const trustedLinks = [
    'https://trending-video-games.herokuapp.com/',
    'https://trending-movies-react-app.herokuapp.com/',
    'https://thedavidbarton.herokuapp.com/',
    'https://twin-peaks-api.herokuapp.com/',
    'https://the-harry-potter-database.herokuapp.com/',
    'https://retro-game-finder.herokuapp.com/'
  ];
  const urlSelector = window.location.href.match(/url(.*)/) ? window.location.href.match(/url(.*)/)[0] : window.location.href;
  const url = urlSelector.replace('url=', '');
  const baseUrlMatcher = url.match(/^https:\/\/(.*?)\//)[0];
  if (trustedLinks.includes(baseUrlMatcher)) {
    if (!window.InstallTrigger) {
      document.querySelector('#refresh').content = `0; URL='${url}'`;
    } else {
      window.setTimeout(() => {
        window.location.href = url;
      }, 6000);
    }
  }
});
