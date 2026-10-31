// Portfolio — Diego Cortes
// Construit la page à partir de data.js, gère les interactions et les animations (GSAP).

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Réglages : ce qui est vide n'est pas affiché.
  // ---------------------------------------------------------------------------
  var CONFIG = {
    email: 'd.cortes@me.com',
    phone: '+33626573074',
    phoneLabel: '+33 6 26 57 30 74',
    github: 'https://github.com/diego-2909',
    linkedin: '', // ex. 'https://www.linkedin.com/in/ton-profil'
    cv: 'assets/CV-Diego-Cortes.pdf',
    photo: 'assets/diego.jpg',
    defaultOpen: null
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    lang: initialLang(),
    open: CONFIG.defaultOpen,
    jobsOpen: {},
    eduOpen: {}
  };

  function initialLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'fr' || q === 'en') return q;
    try {
      var saved = localStorage.getItem('lang');
      if (saved === 'fr' || saved === 'en') return saved;
    } catch (e) { /* stockage indisponible */ }
    return 'fr';
  }

  // ---------------------------------------------------------------------------
  // Outils
  // ---------------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function map(list, fn) { return (list || []).map(fn).join(''); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function linksHtml(t, cvLabel) {
    var out = '<a href="' + esc(CONFIG.github) + '">GitHub</a>';
    if (CONFIG.linkedin) out += '<a href="' + esc(CONFIG.linkedin) + '">LinkedIn</a>';
    out += '<a href="' + esc(CONFIG.cv) + '" download data-track="cv">' + esc(cvLabel) + '</a>';
    return out;
  }

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------
  function renderHeader(t) {
    return '' +
      '<a href="#top" class="name">Diego Cortes</a>' +
      '<div class="header-right">' +
        '<nav class="site-nav" aria-label="' + esc(t.navLabel) + '">' +
          '<a href="#experience">' + esc(t.nav.experience) + '</a>' +
          '<a href="#formation">' + esc(t.nav.education) + '</a>' +
          '<a href="#projets">' + esc(t.nav.projects) + '</a>' +
          '<a href="#competences">' + esc(t.nav.skills) + '</a>' +
          '<a href="#contact">' + esc(t.nav.contact) + '</a>' +
        '</nav>' +
        '<div class="lang" role="group" aria-label="' + esc(t.langLabel) + '">' +
          '<button type="button" data-lang="fr" lang="fr" aria-label="Français" aria-pressed="' + (state.lang === 'fr') + '">FR</button>' +
          '<button type="button" data-lang="en" lang="en" aria-label="English" aria-pressed="' + (state.lang === 'en') + '">EN</button>' +
        '</div>' +
      '</div>';
  }

  function renderHero(t) {
    return '' +
      '<section class="hero" id="top">' +
        '<div class="hero-text">' +
          '<div><h1 class="a-hero">Diego Cortes</h1><p class="role a-hero">' + esc(t.hero.role) + '</p></div>' +
          '<p class="intro a-hero">' + esc(t.hero.intro) + '</p>' +
          '<div class="hero-cta a-hero">' +
            '<a class="btn-primary" href="#contact">' + esc(t.hero.ctaContact) + '</a>' +
            '<a class="btn-secondary" href="' + esc(CONFIG.cv) + '" download data-track="cv">' + esc(t.hero.ctaCv) + '</a>' +
            '<a class="plain hero-gh" href="' + esc(CONFIG.github) + '">GitHub ↗</a>' +
          '</div>' +
        '</div>' +
        '<figure class="portrait">' +
          '<img src="' + esc(CONFIG.photo) + '" alt="' + esc(t.hero.photoAlt) + '" width="539" height="568">' +
          '<figcaption>Toulouse, 2026</figcaption>' +
        '</figure>' +
      '</section>';
  }

  function renderAbout(t) {
    return '' +
      '<section class="section" id="apropos">' +
        '<div class="section-label"><h2>' + esc(t.about.title) + '</h2></div>' +
        '<div class="section-body about">' +
          '<p class="lead a-words">' + esc(t.about.lead) + '</p>' +
          '<div class="about-paras">' + map(t.about.paras, function (p) { return '<p class="a-up">' + esc(p) + '</p>'; }) + '</div>' +
        '</div>' +
      '</section>';
  }

  function renderSeek(t) {
    return '' +
      '<section class="section" id="recherche">' +
        '<div class="section-label"><h2>' + esc(t.seek.title) + '</h2></div>' +
        '<div class="section-body seek">' +
          (t.seek.lead ? '<p class="lead">' + esc(t.seek.lead) + '</p>' : '') +
          '<dl class="rows">' + map(t.seek.rows, function (r) {
            return '<div class="a-up"><dt>' + esc(r.label) + '</dt><dd>' + esc(r.value) + '</dd></div>';
          }) + '</dl>' +
        '</div>' +
      '</section>';
  }

  var CHEVRON = '<svg class="chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>';

  var ARROW_RIGHT = '<svg class="chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';
  var ARROW_LEFT = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>';

  // Couleur pastel par famille de technologie : la même techno a la même couleur partout.
  var TECH_FAMILY = {
    front: ['react', 'next.js', 'typescript', 'javascript', 'vue.js', 'html', 'css', 'html/css', 'ejs'],
    back: ['java', 'spring boot', 'node.js', 'express', 'php', 'laravel', 'c#', '.net', 'c', 'python'],
    data: ['sql', 'mysql', 'postgresql', 'postgis', 'supabase', 'prisma', 'bigquery', 'oracle'],
    cloud: ['docker', 'stripe', 'mapbox', 'capacitor', 'mistral', 'aws'],
    google: ['google apis', 'google apps script', 'apps script', 'google drive api', 'google workspace apis']
  };
  function techItem(x) {
    var k = x.toLowerCase(), fam = '';
    Object.keys(TECH_FAMILY).forEach(function (f) { if (TECH_FAMILY[f].indexOf(k) !== -1) fam = f; });
    return '<li' + (fam ? ' class="t-' + fam + '"' : '') + '>' + esc(x) + '</li>';
  }

  function techList(p, t) {
    return '<ul class="techs" aria-label="' + esc(t.techLabel) + '">' + map(p.stack.split(' · '), techItem) + '</ul>';
  }

  // Un projet sur le fil chronologique. « Aperçu › » ouvre le détail dans un panneau à droite.
  function renderProject(p, t, yearLabel, isLast) {
    return '' +
      '<li class="tl-item' + (isLast ? ' tl-last' : '') + '" id="projet-' + esc(p.id) + '">' +
        '<span class="tl-year">' + esc(yearLabel) + '</span>' +
        '<div class="tl-rail" aria-hidden="true"><span class="tl-line"></span><span class="tl-dot"></span></div>' +
        '<article class="tl-body">' +
          '<div class="project-title"><h3>' + esc(p.name) + '</h3><span>' + esc(p.kind) + '</span></div>' +
          '<p class="project-pitch">' + esc(p.pitch) + '</p>' +
          techList(p, t) +
          '<button type="button" class="tl-toggle" data-project="' + esc(p.id) + '" aria-haspopup="dialog" aria-controls="drawer">' +
            '<span class="label">' + esc(t.p.open) + '</span>' + ARROW_RIGHT +
            '<span class="sr-only"> ' + esc(p.name) + '</span>' +
          '</button>' +
        '</article>' +
      '</li>';
  }

  // Projet mis en avant : la vidéo, puis le titre et « En savoir plus » qui ouvre le panneau.
  function renderFeatured(p, t) {
    var mobile = !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches && p.videoMobile);
    return '' +
      '<article class="featured" id="projet-' + esc(p.id) + '">' +
        '<div class="feat-body">' +
          '<p class="feat-tag">' + esc(t.featured.tag) + ' · ' + esc(p.kind) + '</p>' +
          '<div class="feat-row">' +
            '<div>' +
              '<h3>' + esc(p.name) + '</h3>' +
              '<p class="project-pitch">' + esc(p.pitch) + '</p>' +
              techList(p, t) +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="feat-media' + (mobile ? ' is-vertical' : '') + '">' +
          '<video class="feat-video" src="' + esc(mobile ? p.videoMobile : p.video) + '" poster="' + esc(mobile ? p.posterMobile : p.poster) + '" muted playsinline preload="metadata" aria-label="' + esc(p.videoLabel) + '"></video>' +
          '<button type="button" class="feat-play" data-video-toggle aria-label="' + esc(t.featured.play) + '" data-play="' + esc(t.featured.play) + '" data-pause="' + esc(t.featured.pause) + '">' +
            '<svg class="i-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>' +
            '<svg class="i-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="feat-foot">' +
          '<button type="button" class="feat-more" data-project="' + esc(p.id) + '" aria-haspopup="dialog" aria-controls="drawer">' +
            '<span>' + esc(t.featured.more) + '</span>' + ARROW_RIGHT +
            '<span class="sr-only"> ' + esc(p.name) + '</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  // Lecture automatique quand la vidéo est visible (sauf si l'utilisateur réduit les animations ou l'a mise en pause).
  function setupFeaturedVideo() {
    var v = $('.feat-video');
    if (!v) return;
    var btn = $('[data-video-toggle]');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var userPaused = reduce;
    function sync() {
      var playing = !v.paused;
      btn.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-label', playing ? btn.dataset.pause : btn.dataset.play);
    }
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    btn.addEventListener('click', function () {
      if (v.paused) { userPaused = false; v.play().catch(function () {}); } else { userPaused = true; v.pause(); }
    });
    if (!('IntersectionObserver' in window)) { if (!userPaused) v.play().catch(function () {}); return; }
    // Lecture seulement quand la vidéo est bien à l'écran (au moins 70 %), depuis le début la première fois.
    var started = false;
    var SKIP = 0;
    v.addEventListener('ended', function () { try { v.currentTime = SKIP; } catch (err) { /* ignoré */ } v.play().catch(function () {}); });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.intersectionRatio >= 0.7 && !userPaused) {
          if (!started) {
            started = true;
            var seek = function () { try { v.currentTime = SKIP; } catch (err) { /* ignoré */ } };
            if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true });
          }
          v.play().catch(function () {});
        } else if (e.intersectionRatio < 0.25) v.pause();
      });
    }, { threshold: [0, 0.25, 0.7, 0.85] }).observe(v);
    // Chargement anticipé quand on s'en approche, pour qu'elle démarre sans attendre.
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { v.preload = 'auto'; obs.disconnect(); }
    }, { rootMargin: '900px 0px' }).observe(v);
    sync();
  }

  // Contenu du panneau latéral d'un projet.
  function renderDrawer(p, t) {
    var back = state.lang === 'fr' ? 'Retour' : 'Back';
    var preview = p.img
      ? '<img class="mockup" src="' + esc(p.img) + '" alt="' + esc(p.imgAlt) + '" width="390" height="844">'
      : (p.tree ? '<pre>' + esc(p.tree) + '</pre>' : '');
    var team = map(p.team, function (m) {
      var who = m.url ? '<a class="plain" href="' + esc(m.url) + '">' + esc(m.name) + '</a>' : esc(m.name);
      return '<div class="team-row"><span class="who">' + who + '</span><span class="did">' + esc(m.did) + '</span></div>';
    });
    var links = map(p.links, function (l) { return '<a href="' + esc(l.url) + '">' + esc(l.label) + ' ↗</a>'; });
    if (p.private) links += '<span class="muted">' + esc(p.privateLabel) + '</span>';
    return '' +
      '<div class="drawer-top">' +
        '<button type="button" class="drawer-back" data-close-drawer>' + ARROW_LEFT + '<span>' + esc(back) + '</span></button>' +
        '<span class="drawer-year">' + esc(p.year) + '</span>' +
      '</div>' +
      '<div class="drawer-head">' +
        '<h2 id="drawer-title">' + esc(p.name) + '</h2>' +
        '<p class="drawer-kind">' + esc(p.kind) + '</p>' +
        '<p class="project-pitch">' + esc(p.pitch) + '</p>' +
        techList(p, t) +
      '</div>' +
      '<div class="details">' +
        (p.context ? '<div><h4>' + esc(t.p.context) + '</h4><p>' + esc(p.context) + '</p></div>' : '') +
        (p.result ? '<div><h4>' + esc(t.p.result) + '</h4><p>' + esc(p.result) + '</p></div>' : '') +
        (p.approach && p.approach.length ? '<div><h4>' + esc(t.p.approach) + '</h4><ul>' + map(p.approach, function (a) { return '<li>' + esc(a) + '</li>'; }) + '</ul></div>' : '') +
        (team ? '<div><h4>' + esc(p.teamTitle) + '</h4>' + team + '</div>' : '') +
      '</div>' +
      (preview ? '<div class="preview">' + preview + '<span class="caption">' + esc(p.previewLabel) + '</span></div>' : '') +
      (links ? '<div class="panel-foot">' + links + '</div>' : '');
  }

  // Fil chronologique : « Aujourd'hui » en haut, puis les projets du plus récent au plus ancien.
  function renderProjects(t, projects) {
    var feat = projects.filter(function (p) { return p.featured; })[0];
    var list = projects.filter(function (p) { return !p.inExperience && !p.featured; })
      .map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) { return (Number(b.p.year) - Number(a.p.year)) || (a.i - b.i); })
      .map(function (x) { return x.p; });
    var items = list.map(function (p, i) {
      var prev = list[i - 1];
      return renderProject(p, t, prev && prev.year === p.year ? '' : p.year, i === list.length - 1);
    }).join('');
    return '' +
      '<section class="section" id="projets">' +
        '<div class="section-label"><h2>' + esc(t.nav.projects) + '</h2><a href="' + esc(CONFIG.github) + '?tab=repositories">github.com/diego-2909</a></div>' +
        '<div class="section-body">' +
          (feat ? renderFeatured(feat, t) + '<h3 class="others-title">' + esc(t.featured.others) + '</h3>' : '') +
          '<ol class="timeline" aria-label="' + esc(t.timelineLabel) + '">' +
            '<li class="tl-item tl-now">' +
              '<span class="tl-year muted">' + esc(t.now.when) + '</span>' +
              '<div class="tl-rail" aria-hidden="true"><span class="tl-line"></span>' +
                '<svg class="tl-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14l6-6 6 6"></path></svg>' +
              '</div>' +
              '<div class="tl-body">' +
                '<p class="tl-now-title">' + esc(t.now.title) + '</p>' +
                '<div class="tl-now-items">' + map(t.now.items, function (n) {
                  return '<p><span class="n">' + esc(n.name) + '</span> <span class="t">· ' + esc(n.text) + '</span></p>';
                }) + '</div>' +
              '</div>' +
            '</li>' +
            items +
          '</ol>' +
        '</div>' +
      '</section>';
  }

  function jobLabel(job, i) {
    var n = job.projects.length;
    var open = !!state.jobsOpen[i];
    if (state.lang === 'fr') return open ? 'Masquer les réalisations' : 'Voir les réalisations (' + n + ')';
    return open ? 'Hide what I delivered' : 'See what I delivered (' + n + ')';
  }

  function moreBtn(kind, i, label, name) {
    return '<button type="button" class="more-btn" data-detail="' + kind + ':' + i + '" aria-haspopup="dialog" aria-controls="push">' +
      '<span>' + esc(label) + '</span>' + ARROW_RIGHT + '<span class="sr-only"> · ' + esc(name) + '</span></button>';
  }

  function renderExperience(t) {
    return '' +
      '<section class="section" id="experience">' +
        '<div class="section-label"><h2>' + esc(t.nav.experience) + '</h2></div>' +
        '<div class="section-body edu-list">' + map(t.jobs, function (j, i) {
          return '' +
            '<button type="button" class="edu-row job-row a-up" data-detail="job:' + i + '" aria-haspopup="dialog" aria-controls="push">' +
              '<span class="edu-txt"><span class="when">' + esc(j.dates) + ' · ' + esc(j.place) + '</span>' +
                '<span class="name">' + esc(j.company) + '</span><span class="school">' + esc(j.role) + '</span>' +
                '<span class="row-more">' + esc(t.detail.more) + '</span></span>' +
              (j.logoUrl ? '<span class="edu-logo"><img src="' + esc(j.logoUrl) + '" alt="" data-logo="job:' + i + '"></span>' : '') +
              '<span class="edu-chev" aria-hidden="true">' + ARROW_RIGHT + '</span>' +
            '</button>';
        }) + '</div>' +
      '</section>';
  }

  // Panneau « Plus de détails » : toute la page glisse vers la gauche, le détail arrive par la droite.
  function renderJobDetail(j, i, t) {
    return '' +
      '<div class="push-top"><button type="button" class="drawer-back" data-close-push>' + ARROW_LEFT + '<span>' + esc(t.detail.back) + '</span></button>' +
        '<span class="drawer-year">' + esc(j.dates) + '</span></div>' +
      '<header class="push-head">' +
        (j.logoUrl ? '<div class="push-logo"><img src="' + esc(j.logoUrl) + '" alt=""></div>' : '') +
        '<p class="push-kicker">' + esc(t.nav.experience) + ' · ' + esc(j.place) + '</p>' +
        '<h2 id="push-title" tabindex="-1">' + esc(j.company) + '</h2>' +
        '<p class="push-sub">' + esc(j.role) + '</p>' +
      '</header>' +
      (j.bullets && j.bullets.length ? '<div class="push-block"><h3>' + esc(t.detail.missions) + '</h3><ul class="push-list">' + map(j.bullets, function (b) { return '<li>' + esc(b) + '</li>'; }) + '</ul></div>' : '') +
      '<div class="push-block"><h3>' + esc(t.projectsDone) + '</h3>' +
        map(j.projects, function (jp) {
          return '<div class="push-project">' +
            '<div class="pp-main"><p class="pp-name">' + esc(jp.name) + '</p><p class="pp-text">' + esc(jp.text) + '</p>' +
              '<ul class="techs">' + map(jp.stack.split(' · '), techItem) + '</ul></div>' +
            (jp.projectId ? '<button type="button" class="tl-toggle small" data-project="' + esc(jp.projectId) + '" aria-haspopup="dialog" aria-controls="drawer">' +
              '<span class="label">' + esc(t.p.open) + '</span>' + ARROW_RIGHT + '<span class="sr-only"> ' + esc(jp.name) + '</span></button>' : '') +
          '</div>';
        }) +
      '</div>';
  }

  function renderEduDetail(e, i, t) {
    return '' +
      '<div class="push-top"><button type="button" class="drawer-back" data-close-push>' + ARROW_LEFT + '<span>' + esc(t.detail.back) + '</span></button>' +
        '<span class="drawer-year">' + esc(e.dates) + '</span></div>' +
      '<header class="push-head">' +
        (e.logoUrl ? '<div class="push-logo"><img src="' + esc(e.logoUrl) + '" alt=""></div>' : '') +
        '<p class="push-kicker">' + esc(t.nav.education) + '</p>' +
        '<h2 id="push-title" tabindex="-1">' + esc(e.name) + '</h2>' +
        '<p class="push-sub">' + esc(e.school) + '</p>' +
      '</header>' +
      '<div class="push-block"><p class="push-text">' + esc(e.more) + '</p></div>' +
      map(e.groups || [], function (g) {
        return '<div class="push-block"><h3>' + esc(g.title) + '</h3><ul class="chips">' + map(g.items, function (x) { return '<li>' + esc(x) + '</li>'; }) + '</ul></div>';
      }) +
      (e.jobs ? '<div class="push-block"><h3>' + esc(t.eduJobs) + '</h3><p class="push-text">' + esc(e.jobs) + '</p></div>' : '');
  }

  function renderSkills(t) {
    return '' +
      '<section class="section" id="competences">' +
        '<div class="section-label"><h2>' + esc(t.nav.skills) + '</h2></div>' +
        '<div class="section-body"><div class="skill-rows">' + map(t.skills, function (s) {
          return '<div class="skill-row"><h3>' + esc(s.title) + '</h3><ul>' + map(s.items, function (i) { return '<li>' + esc(i) + '</li>'; }) + '</ul></div>';
        }) + '</div></div>' +
      '</section>';
  }

  function renderEducation(t) {
    return '' +
      '<section class="section" id="formation">' +
        '<div class="section-label"><h2>' + esc(t.nav.education) + '</h2></div>' +
        '<div class="section-body edu-list">' + map(t.education, function (e, i) {
          return '' +
            '<button type="button" class="edu-row a-up" data-detail="edu:' + i + '" aria-haspopup="dialog" aria-controls="push">' +
              '<span class="edu-txt"><span class="when">' + esc(e.dates) + '</span><span class="name">' + esc(e.name) + '</span><span class="school">' + esc(e.school) + '</span></span>' +
              (e.logoUrl ? '<span class="edu-logo"><img src="' + esc(e.logoUrl) + '" alt="" data-logo="edu:' + i + '"></span>' : '') +
              '<span class="edu-chev" aria-hidden="true">' + ARROW_RIGHT + '</span>' +
              '<span class="sr-only"> · ' + esc(t.detail.more) + '</span>' +
            '</button>';
        }) +
        (t.certs && t.certs.length ? '<div class="certs"><p class="certs-title">' + esc(t.certsTitle) + '</p>' + map(t.certs, function (c) {
          return '<div class="cert"><img src="' + esc(c.img) + '" alt="" width="48" height="51">' +
            '<div class="cert-main"><p class="cert-name">' + esc(c.name) + '</p><p class="cert-issuer">' + esc(c.issuer) + '</p>' +
            '<a class="cert-link" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.link) + ' ↗</a></div></div>';
        }) + '</div>' : '') +
        '</div>' +
      '</section>';
  }

  function renderContact(t) {
    var rows = [
      [t.contact.email, '<a href="mailto:' + esc(CONFIG.email) + '">' + esc(CONFIG.email) + '</a>'],
      [t.contact.phone, '<a href="tel:' + esc(CONFIG.phone) + '">' + esc(CONFIG.phoneLabel) + '</a>'],
      ['GitHub', '<a href="' + esc(CONFIG.github) + '">github.com/diego-2909</a>']
    ];
    if (CONFIG.linkedin) rows.push(['LinkedIn', '<a href="' + esc(CONFIG.linkedin) + '">LinkedIn</a>']);
    rows.push(['CV', '<a href="' + esc(CONFIG.cv) + '" download data-track="cv">' + esc(t.contact.cv) + '</a>']);
    return '' +
      '<section class="section contact" id="contact">' +
        '<div class="section-label"><h2>' + esc(t.nav.contact) + '</h2></div>' +
        '<div class="section-body contact-body">' +
          (t.contact.lead ? '<p class="lead">' + esc(t.contact.lead) + '</p>' : '') +
          '<dl class="rows contact-rows">' + map(rows, function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + '</dd></div>'; }) + '</dl>' +
        '</div>' +
      '</section>';
  }

  function renderFooter(t) {
    var note = state.lang === 'fr' ? 'Statistiques de visite anonymes, sans cookie.' : 'Anonymous visit statistics, no cookies.';
    return '<span>Diego Cortes, Toulouse, 2026<span class="footer-note"><span class="sep" aria-hidden="true"> · </span>' + esc(note) + '</span></span><div class="links">' + linksHtml(t, 'CV') + '</div>';
  }

  // ---------------------------------------------------------------------------
  // Liens uniques par recruteur : diego-cortes.dev/?r=code
  // Enregistre l'ouverture du lien et ce qui est consulté (aperçus, CV, langue).
  // Rien n'est envoyé sans code valide ou tant que config.js est vide.
  // Côté base : supabase/schema.sql.
  // ---------------------------------------------------------------------------
  var tracking = (function () {
    var cfg = window.PORTFOLIO_CONFIG || {};
    var enabled = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
    function read(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
    function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignoré */ } }

    // Le code vient de l'adresse : diego-cortes.dev/cg (code court) ou diego-cortes.dev/?r=k7f3x9ab.
    var CODE_RE = /^[a-z0-9][a-z0-9-]{1,19}$/;
    var fromPath = decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g, '')).toLowerCase();
    var fromQuery = (new URLSearchParams(location.search).get('r') || '').toLowerCase();
    var fromUrl = CODE_RE.test(fromQuery) ? fromQuery : (CODE_RE.test(fromPath) && fromPath !== 'index.html' ? fromPath : '');
    var code = fromUrl || read('pf_r');
    if (code) store('pf_r', code);
    // Le code est gardé pour la visite, puis retiré de l'adresse affichée : elle redevient diego-cortes.dev.
    if ((fromPath || fromQuery) && window.history && history.replaceState) {
      try {
        var u = new URL(location.href);
        u.searchParams.delete('r');
        history.replaceState(history.state, '', '/' + (u.search ? u.search : '') + u.hash);
      } catch (e) { /* ignoré */ }
    }
    var session = read('pf_s');
    if (!session) {
      session = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      store('pf_s', session);
    }

    function send(event, detail) {
      if (!enabled || !code) return;
      try {
        fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1/rpc/track', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json', apikey: cfg.supabaseAnonKey },
          body: JSON.stringify({ p_code: code, p_session: session, p_event: event, p_detail: detail || null })
        }).catch(function () { /* le suivi ne doit jamais gêner la visite */ });
      } catch (e) { /* idem */ }
    }

    // L'ouverture est comptée une fois par session, après une seconde de page visible :
    // les robots d'aperçu (LinkedIn, Slack, Outlook…) n'exécutent pas ce code ou repartent avant.
    function opened() {
      if (!enabled || !code || read('pf_opened') === code) return;
      var timer = null;
      function arm() {
        clearTimeout(timer);
        if (document.visibilityState !== 'visible') return;
        timer = setTimeout(function () {
          if (document.visibilityState !== 'visible' || read('pf_opened') === code) return;
          store('pf_opened', code);
          document.removeEventListener('visibilitychange', arm);
          send('open', state.lang);
        }, 1000);
      }
      // Onglet ouvert en arrière-plan (Cmd+clic depuis un mail) : on attend qu'il soit affiché.
      document.addEventListener('visibilitychange', arm);
      arm();
    }

    return { send: send, opened: opened };
  })();

  function render() {
    var content = getContent(state.lang);
    var t = content.t;
    document.documentElement.lang = t.code;
    document.title = state.lang === 'fr' ? 'Diego Cortes — Développeur full-stack' : 'Diego Cortes — Full-stack developer';
    $('#skip-link').textContent = state.lang === 'fr' ? 'Aller au contenu' : 'Skip to content';
    $('#header').innerHTML = renderHeader(t);
    $('#main').innerHTML =
      renderHero(t) + renderAbout(t) + renderExperience(t) + renderEducation(t) +
      renderProjects(t, content.projects) + renderSkills(t) + renderContact(t);
    $('#footer').innerHTML = renderFooter(t);
    return content;
  }

  // ---------------------------------------------------------------------------
  // Interactions
  // ---------------------------------------------------------------------------
  var current = null;

  // Panneau latéral : il glisse depuis la droite, la page reste visible à gauche, floutée.
  var drawerTrigger = null;

  function openDrawer(id) {
    var p = current.projects.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    tracking.send('project', id);
    var drawer = $('#drawer');
    var panel = $('.drawer-panel', drawer);
    panel.innerHTML = renderDrawer(p, current.t);
    panel.scrollTop = 0;
    drawerTrigger = document.activeElement;
    state.open = id;
    var item = document.getElementById('projet-' + id);
    if (item) item.classList.add('is-open');
    drawer.hidden = false;
    document.documentElement.classList.add('drawer-lock');
    // Laisse le navigateur afficher le panneau fermé avant de lancer la transition.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    });
    var title = $('#drawer-title', panel);
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
  }

  function closeDrawer() {
    var drawer = $('#drawer');
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    if ($('#push').hidden) document.documentElement.classList.remove('drawer-lock');
    var item = state.open && document.getElementById('projet-' + state.open);
    if (item) item.classList.remove('is-open');
    state.open = null;
    var done = function () { drawer.hidden = true; };
    if (reduceMotion) done(); else setTimeout(done, 450);
    if (drawerTrigger && drawerTrigger.focus) drawerTrigger.focus({ preventScroll: true });
  }

  function toggleProject(id) { openDrawer(id); }

  var pushTrigger = null;
  function openPush(key) {
    var parts = key.split(':'), kind = parts[0], i = Number(parts[1]);
    var t = current.t, item = kind === 'job' ? t.jobs[i] : t.education[i];
    if (!item) return;
    var push = $('#push'), panel = $('.push-panel', push);
    panel.innerHTML = kind === 'job' ? renderJobDetail(item, i, t) : renderEduDetail(item, i, t);
    panel.scrollTop = 0;
    pushTrigger = document.activeElement;
    tracking.send('project', (kind === 'job' ? 'exp:' : 'edu:') + (kind === 'job' ? item.company : item.dates).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40));
    push.hidden = false;
    document.documentElement.classList.add('drawer-lock');
    var src = $('[data-logo="' + key + '"]'), dst = $('.push-logo img', panel);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.add('is-pushed');
        push.classList.add('is-open');
        flyLogo(src, dst, panel);
        var title = $('#push-title', panel);
        if (title) title.focus({ preventScroll: true });
      });
    });
  }

  // Le logo de la carte s'envole vers l'en-tête du panneau : on suit l'élément d'un écran à l'autre.
  function flyLogo(src, dst, panel) {
    if (!src || !dst || reduceMotion || !src.animate) return;
    var a = src.getBoundingClientRect();
    var w = panel.getBoundingClientRect().width;
    var b = dst.getBoundingClientRect();
    if (!a.width || !b.width) return;
    // Le panneau part de translateX(100 %) : sa position finale est décalée de sa largeur.
    var m = new DOMMatrix(getComputedStyle(panel).transform);
    var bl = b.left - m.m41, bt = b.top;
    var clone = src.cloneNode();
    clone.className = 'logo-fly';
    clone.style.cssText = 'position:fixed;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;z-index:60;pointer-events:none;object-fit:contain;';
    document.body.appendChild(clone);
    dst.style.visibility = 'hidden';
    var anim = clone.animate([
      { transform: 'translate(0,0) scale(1)' },
      { transform: 'translate(' + (bl - a.left + (b.width - a.width) / 2) + 'px,' + (bt - a.top + (b.height - a.height) / 2) + 'px) scale(' + (b.width / a.width) + ')' }
    ], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    anim.onfinish = function () { dst.style.visibility = ''; clone.remove(); };
  }

  function closePush() {
    var push = $('#push');
    if (push.hidden) return;
    push.classList.remove('is-open');
    document.documentElement.classList.remove('is-pushed');
    var done = function () { push.hidden = true; if ($('#drawer').hidden) document.documentElement.classList.remove('drawer-lock'); };
    if (reduceMotion) done(); else setTimeout(done, 520);
    if (pushTrigger && pushTrigger.focus) pushTrigger.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!$('#drawer').hidden) closeDrawer(); else closePush(); return; }
    // Garde le focus dans le panneau ouvert (projet, sinon détail).
    var box = !$('#drawer').hidden ? '#drawer .drawer-panel' : (!$('#push').hidden ? '#push .push-panel' : null);
    if (e.key === 'Tab' && box) {
      var f = $all(box + ' a[href], ' + box + ' button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function toggleJob(i) {
    state.jobsOpen[i] = !state.jobsOpen[i];
    var open = state.jobsOpen[i];
    var btn = $('[data-job="' + i + '"]');
    var list = document.getElementById('job-' + i);
    btn.setAttribute('aria-expanded', String(open));
    $('.label', btn).textContent = jobLabel(current.t.jobs[i], i);
    $('.sign', btn).textContent = open ? '−' : '+';
    if (open) {
      list.hidden = false;
      if (canAnimate()) {
        gsap.fromTo($all('.job-project', list), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power2.out', onComplete: refreshScroll });
      } else { refreshScroll(); }
    } else {
      list.hidden = true;
      refreshScroll();
    }
  }

  function toggleEdu(i) {
    state.eduOpen[i] = !state.eduOpen[i];
    var open = state.eduOpen[i];
    var t = current.t;
    var btn = $('[data-edu="' + i + '"]');
    var box = document.getElementById('edu-' + i);
    btn.setAttribute('aria-expanded', String(open));
    $('.label', btn).textContent = open ? t.eduLess : t.eduMore;
    box.hidden = !open;
    if (open && canAnimate()) {
      gsap.fromTo(box, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', onComplete: refreshScroll });
    } else {
      refreshScroll();
    }
  }

  function setLang(lang) {
    if (lang === state.lang) return;
    closeDrawer();
    closePush();
    state.lang = lang;
    tracking.send('lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e) { /* ignoré */ }
    var y = window.scrollY;
    killAnimations();
    current = render();
    setupAnimations(false);
    window.scrollTo(0, y);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, a');
    if (!el) return;
    if (el.dataset.track === 'cv') { tracking.send('cv'); return; }
    if (el.hasAttribute('data-close-drawer')) { closeDrawer(); return; }
    if (el.hasAttribute('data-close-push')) { closePush(); return; }
    if (el.dataset.detail) { openPush(el.dataset.detail); return; }
    if (el.dataset.lang) { setLang(el.dataset.lang); return; }
    if (el.dataset.project) { toggleProject(el.dataset.project); return; }
    if (el.dataset.job != null) { toggleJob(Number(el.dataset.job)); return; }
    if (el.dataset.edu != null) { toggleEdu(Number(el.dataset.edu)); return; }
  });

  // ---------------------------------------------------------------------------
  // Animations (GSAP + ScrollTrigger). Désactivées si le visiteur réduit les animations.
  // ---------------------------------------------------------------------------
  function canAnimate() {
    return !reduceMotion && typeof window.gsap !== 'undefined';
  }
  function canScrollAnimate() {
    return canAnimate() && typeof window.ScrollTrigger !== 'undefined';
  }
  function refreshScroll() {
    if (canScrollAnimate()) ScrollTrigger.refresh();
  }
  function killAnimations() {
    if (!canScrollAnimate()) return;
    ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
  }

  // Les blocs qui apparaissent au scroll : chaque section entière, d'un seul coup, une seule fois.
  var REVEAL = '.section, .site-footer';

  // Logos d'entreprise : ils sont affichés tout de suite, et s'inclinent en 3D au survol.
  function setupLogoHover() {
    if (!canAnimate()) return;
    $all('.job-logo').forEach(function (box) {
      var img = $('img', box);
      gsap.set(img, { transformPerspective: 600 });
      box.addEventListener('mousemove', function (e) {
        var r = box.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(img, { rotateY: dx * 34, rotateX: -dy * 34, scale: 1.06, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });
      box.addEventListener('mouseleave', function () {
        gsap.to(img, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      });
    });
  }

  function setupAnimations(entrance) {
    setupLogoHover();
    setupFeaturedVideo();
    if (!canScrollAnimate()) return;
    gsap.registerPlugin(ScrollTrigger);

    // Après un changement de langue, tout reste visible : pas de nouvelle apparition.
    if (!entrance) return;

    // Haut de page : apparaît d'un bloc au chargement.
    gsap.from('.site-header, .hero', { y: 16, opacity: 0, duration: 0.8, ease: 'power2.out' });

    // Le reste : chaque section apparaît en entier quand elle arrive à l'écran.
    gsap.set(REVEAL, { opacity: 0, y: 32 });
    $all(REVEAL).forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        // Le pied de page est tout en bas : il apparaît dès qu'il entre à l'écran.
        start: el.classList.contains('site-footer') ? 'top bottom' : 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', overwrite: true });
        }
      });
    });

    ScrollTrigger.refresh();
  }

  // ---------------------------------------------------------------------------
  // Démarrage
  // ---------------------------------------------------------------------------
  current = render();
  setupAnimations(true);
  tracking.opened();
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
  window.addEventListener('load', refreshScroll);
})();
