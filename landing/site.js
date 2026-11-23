// Shared behaviour for divera.app pages (/, /app/, /ciencia/).
// Load after i18n.js. Each block is a no-op when its elements are absent.
(function () {
  // DEPTH METER
  const depthMeter = document.getElementById('depthMeter');
  if (depthMeter) {
    const depthDot = document.getElementById('depthDot');
    const depthTop = document.getElementById('depthTop');
    const MAX_DEPTH = 40;
    const updateDepthMeter = (scrollPercent) => {
      const t = Math.max(0, Math.min(1, scrollPercent));
      depthDot.style.top = (t * 100) + '%';
      depthTop.textContent = Math.round(t * MAX_DEPTH) + 'm';
      depthMeter.classList.toggle('visible', t > 0.02);
    };
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      updateDepthMeter(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // SCROLL REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  // i18n
  const translations = window.DIVERA_I18N;
  // Per-page <title>/description keys: <body data-title-key="appPageTitle" data-desc-key="appPageDesc">
  const TITLE_KEY = document.body.dataset.titleKey || 'pageTitle';
  const DESC_KEY = document.body.dataset.descKey || 'pageDesc';
  const LANG_LABELS = { en: 'EN', es: 'ES', fr: 'FR', ca: 'CA' };
  const SUPPORTED_LANGS = ['en', 'es', 'fr', 'ca'];

  function getInitialLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && SUPPORTED_LANGS.includes(q)) return q;
    const stored = localStorage.getItem('divera-lang');
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const browser = (navigator.language || 'es').slice(0, 2);
    return SUPPORTED_LANGS.includes(browser) ? browser : 'es';
  }

  let currentLang = getInitialLang();

  // Detect the visitor's OS so the single Download button can route correctly:
  // iOS -> App Store, Android -> Google Play, desktop/unknown -> platform chooser.
  let osIsIOS = false, osIsAndroid = false;
  (function detectStore() {
    const ua = navigator.userAgent || navigator.vendor || '';
    osIsIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    osIsAndroid = /Android/.test(ua);
    if (osIsAndroid) document.documentElement.classList.add('is-android');
    else if (osIsIOS) document.documentElement.classList.add('is-ios');
  })();

  function applyTranslations(lang) {
    const tx = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (tx[k] !== undefined) el.innerHTML = tx[k];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (tx[k] !== undefined) el.placeholder = tx[k];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const k = el.getAttribute('data-i18n-aria');
      if (tx[k] !== undefined) el.setAttribute('aria-label', tx[k]);
    });
    document.documentElement.lang = lang;
    document.getElementById('langCurrent').textContent = LANG_LABELS[lang];
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
    if (tx[TITLE_KEY]) document.title = tx[TITLE_KEY];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && tx[DESC_KEY]) metaDesc.setAttribute('content', tx[DESC_KEY]);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && tx[TITLE_KEY]) ogTitle.setAttribute('content', tx[TITLE_KEY]);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && tx[DESC_KEY]) ogDesc.setAttribute('content', tx[DESC_KEY]);
    markLineupEnds();
  }

  // REC LINE-UP: hide the coral dot after the last item of each wrapped line.
  // offsetTop is layout-only, so the .reveal transform does not affect it.
  function markLineupEnds() {
    document.querySelectorAll('.rec-lineup').forEach(ul => {
      const items = Array.from(ul.children);
      items.forEach((li, i) => {
        const next = items[i + 1];
        li.classList.toggle('rec-eol', !next || next.offsetTop > li.offsetTop + 2);
      });
    });
  }
  let lineupRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(lineupRaf);
    lineupRaf = requestAnimationFrame(markLineupEnds);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(markLineupEnds);

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('divera-lang', lang);
    applyTranslations(lang);
  }

  const langSwitcher = document.getElementById('langSwitcher');
  const langBtn = document.getElementById('langBtn');
  langBtn.addEventListener('click', (e) => { e.stopPropagation(); langSwitcher.classList.toggle('open'); });
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => { setLang(opt.dataset.lang); langSwitcher.classList.remove('open'); });
  });
  document.addEventListener('click', () => langSwitcher.classList.remove('open'));
  applyTranslations(currentLang);

  // EMAIL WAITLIST FORM
  const waitlistForm = document.getElementById('waitlistForm');
  const emailNoteEl  = document.getElementById('emailNote');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = waitlistForm.querySelector('input[type="email"]').value;
      const btn = waitlistForm.querySelector('.email-submit');
      btn.disabled = true; btn.textContent = '...';
      try {
        const res = await fetch('https://formsubmit.co/ajax/diveradevelopers@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, _subject: 'Divera Waitlist Signup', _captcha: 'false' })
        });
        if (!res.ok) throw new Error('Server error');
        const json = await res.json();
        if (!json.success) throw new Error('Submission failed');
        waitlistForm.style.display = 'none';
        emailNoteEl.className = 'email-success';
        emailNoteEl.textContent = translations[currentLang].emailSuccess || 'You\'re on the list.';
      } catch {
        emailNoteEl.className = 'email-error';
        emailNoteEl.textContent = translations[currentLang].formError || 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = translations[currentLang].emailBtn || 'Notify Me';
      }
    });
  }

  // DOWNLOAD ROUTING — iOS anchors already point to the App Store. Android and
  // desktop are handled here: Android jumps straight to Google Play; desktop
  // opens the platform chooser (both stores are live).
  const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.divera';
  const pmModal = document.getElementById('platformModal');
  if (pmModal) {
    const openPm  = () => { pmModal.classList.add('open'); pmModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const closePm = () => { pmModal.classList.remove('open'); pmModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    document.getElementById('pmClose').addEventListener('click', closePm);
    pmModal.addEventListener('click', (e) => { if (e.target === pmModal) closePm(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pmModal.classList.contains('open')) closePm(); });

    // Single Download button: iOS -> App Store (anchor proceeds), Android -> Play, desktop -> chooser
    document.querySelectorAll('[data-download-cta]').forEach(el => el.addEventListener('click', (e) => {
      if (osIsIOS) return;
      e.preventDefault();
      if (osIsAndroid) window.open(PLAY_URL, '_blank', 'noopener');
      else openPm();
    }));
  }

  // CONTACT FORM
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm));
      const btn = contactForm.querySelector('.pf-submit');
      btn.disabled = true; btn.textContent = '...';
      try {
        const res = await fetch('https://formsubmit.co/ajax/diveradevelopers@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: data.email, message: data.message, _subject: 'Divera Contact: ' + data.subject, _captcha: 'false', _replyto: data.email })
        });
        if (!res.ok) throw new Error('Server error');
        const json = await res.json();
        if (!json.success) throw new Error('Submission failed');
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
      } catch {
        const errEl = document.getElementById('contactError');
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = translations[currentLang].formError || 'Something went wrong. Please try again.'; }
        btn.disabled = false;
        btn.textContent = translations[currentLang].contactSubmit || 'Send message';
      }
    });
  }
})();
