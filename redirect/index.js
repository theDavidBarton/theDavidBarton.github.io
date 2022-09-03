'use strict';

// redirection page
document.addEventListener('DOMContentLoaded', () => {
  const trustedLinks = [
    'https://trending-video-games-frontend.onrender.com',
    'https://trending-movies-react-app-frontend.onrender.com',
    'https://thedavidbarton.onrender.com',
    'https://the-harry-potter-database-frontend.onrender.com',
    'https://retro-game-finder-frontend.onrender.com'
  ];
  const urlSelector = window.location.href.match(/url(.*)/) ? window.location.href.match(/url(.*)/)[0] : window.location.href;
  const url = urlSelector.replace('url=', '');

  if (trustedLinks.includes(url)) {
    document.querySelector('#preconnect').href = url
    if (!window.InstallTrigger) {
      document.querySelector('#refresh').content = `7; URL='${url}'`;
    } else {
      window.setTimeout(() => {
        window.location.href = url;
      }, 6000);
    }
  }
});
