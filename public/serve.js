(function () {
  'use strict';

  var script = document.currentScript;
  var baseUrl = script && script.src ? new URL(script.src).origin : window.location.origin;
  var namespace = window.APAds || {};
  window.APAds = namespace;

  function requestJson(url, options) {
    return fetch(url, options).then(function (response) {
      if (!response.ok) throw new Error('AP Ads request failed');
      return response.json();
    });
  }

  function renderSlot(element) {
    var slot = element.getAttribute('data-ap-ad-slot');
    if (!slot || element.getAttribute('data-ap-ad-rendered') === 'true') return;

    var property = element.getAttribute('data-ap-property') || '';
    var url = new URL(baseUrl + '/api/public/ad');
    url.searchParams.set('slot', slot);
    url.searchParams.set('domain', window.location.hostname);
    url.searchParams.set('page_url', window.location.href);
    if (property) url.searchParams.set('property', property);

    requestJson(url.toString())
      .then(function (payload) {
        var ad = payload && payload.ok && payload.data ? payload.data.ad : null;
        if (!ad) return;

        var link = document.createElement('a');
        link.href = ad.click_url + '?page_url=' + encodeURIComponent(window.location.href);
        link.target = '_blank';
        link.rel = 'noopener sponsored';

        var image = document.createElement('img');
        image.src = ad.image_url;
        image.alt = ad.alt_text || '';
        image.loading = 'lazy';
        image.style.maxWidth = '100%';
        image.style.height = 'auto';
        image.style.display = 'block';

        link.appendChild(image);
        element.innerHTML = '';
        element.appendChild(link);
        element.setAttribute('data-ap-ad-rendered', 'true');
        observeImpression(element, ad);
      })
      .catch(function () {});
  }

  function observeImpression(element, ad) {
    if (!('IntersectionObserver' in window)) return;
    var timer = null;
    var tracked = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (tracked) return;
        if (entry.intersectionRatio >= 0.5) {
          timer = window.setTimeout(function () {
            tracked = true;
            observer.disconnect();
            trackImpression(ad);
          }, 1000);
        } else if (timer) {
          window.clearTimeout(timer);
          timer = null;
        }
      });
    }, { threshold: [0, 0.5, 1] });
    observer.observe(element);
  }

  function trackImpression(ad) {
    var body = JSON.stringify({
      property_id: ad.property_id,
      placement_id: ad.placement_id,
      advertiser_id: ad.advertiser_id,
      campaign_id: ad.campaign_id,
      ad_id: ad.ad_id,
      page_url: window.location.href,
      metadata: { viewable: true }
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(baseUrl + '/api/public/impression', new Blob([body], { type: 'application/json' }));
      return;
    }

    requestJson(baseUrl + '/api/public/impression', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body,
      keepalive: true
    }).catch(function () {});
  }

  namespace.refresh = function () {
    document.querySelectorAll('[data-ap-ad-slot]').forEach(renderSlot);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', namespace.refresh);
  } else {
    namespace.refresh();
  }
})();
