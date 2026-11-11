// Small progressive enhancements. The page is fully readable without this file.
(function () {
  var root = document.documentElement;

  // Theme toggle, remembered between visits.
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  // Hairline under the nav once the page scrolls.
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Fade sections in as they enter the viewport.
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach(function (el) { revealObserver.observe(el); });

  // Count the headline numbers up once.
  function format(value, el) {
    var decimals = Number(el.dataset.decimals || 0);
    var text = value.toFixed(decimals);
    return el.dataset.format === 'comma' ? Number(text).toLocaleString('en-US') : text;
  }
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = Number(el.dataset.count);
      var start = performance.now();
      var duration = 1400;
      countObserver.unobserve(el);
      (function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = format(target * eased, el);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = format(target, el);
      })(start);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { countObserver.observe(el); });
})();
