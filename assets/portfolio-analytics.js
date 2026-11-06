/* Privacy-friendly visitor analytics for the GitHub Pages portfolio.
 * Pages displayed through the hash router are tracked as separate pages.
 * Requires no cookies, credentials, or build system.
 */
(function () {
  'use strict';

  var routedPages = new Set([
    'index.html', 'research.html', 'positioning.html', 'projects.html',
    'publications.html', 'news.html', 'journey.html', 'group.html',
    'experience.html', 'contact.html'
  ]);
  var lastTrackedPath = null;

  function currentPagePath() {
    var virtualPage = window.location.hash.slice(1).split('#')[0];
    if (routedPages.has(virtualPage)) {
      return '/' + virtualPage;
    }
    var pathname = window.location.pathname;
    return pathname === '/' ? '/index.html' : pathname;
  }

  function trackPage() {
    var analytics = window.goatcounter;
    if (!analytics || typeof analytics.count !== 'function') return;

    var path = currentPagePath();
    if (path === lastTrackedPath) return;

    analytics.count({ path: path, title: document.title });
    lastTrackedPath = path;
  }

  // Let the router finish changing the document title before counting.
  // Ignore within-page anchors and repeated visits to the same virtual page.
  window.goatcounter = { no_onload: true };
  document.addEventListener('portfolio:route', trackPage);
  window.addEventListener('hashchange', trackPage);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', 'https://ahmedmansoour.goatcounter.com/count');
  script.addEventListener('load', trackPage);
  document.head.appendChild(script);
})();
