// Mobile nav menu for every divera.app page (/, /app/, /ciencia/, /centros/).
// The page links live in #navLinks; at mobile widths CSS hides them until
// nav.menu-open. No-op when the button is absent.
(function () {
  var btn = document.getElementById('navMenuBtn');
  var links = document.getElementById('navLinks');
  if (!btn || !links) return;
  var nav = btn.closest('nav');
  var isOpen = function () { return nav.classList.contains('menu-open'); };
  function setOpen(open, focusBtn) {
    nav.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      var first = Array.prototype.find.call(links.querySelectorAll('a'), function (a) { return a.offsetParent !== null; });
      if (first) first.focus();
    } else if (focusBtn) {
      btn.focus();
    }
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!isOpen()); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', function (e) { if (isOpen() && !nav.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) setOpen(false, true); });
  window.matchMedia('(min-width: 769px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
})();
