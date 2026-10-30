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
          '<a href="#formation">' + esc(t.nav.education) + '</a>' +
          '<a href="#experience">' + esc(t.nav.experience) + '</a>' +
          '<a href="#competences">' + esc(t.nav.skills) + '</a>' +
          '<a href="#projets">' + esc(t.nav.projects) + '</a>' +
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
          '<dl class="facts a-hero">' +
            '<dt>' + esc(t.hero.basedLabel) + '</dt><dd>Toulouse</dd>' +
            '<dt>' + esc(t.hero.degreeLabel) + '</dt><dd>' + esc(t.hero.degree) + '</dd>' +
            '<dt>' + esc(t.hero.linksLabel) + '</dt><dd class="links">' + linksHtml(t, t.hero.cv) + '</dd>' +
          '</dl>' +
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
          '<dl class="points">' + map(t.about.points, function (p) {
            return '<div class="a-up"><dt>' + esc(p.title) + '</dt><dd>' + esc(p.text) + '</dd></div>';
          }) + '</dl>' +
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

  // Un projet sur le fil chronologique.
  function renderProject(p, t, yearLabel, isLast) {
    var isOpen = state.open === p.id;
    var techs = p.stack.split(' · ');
    var preview = p.img
      ? '<img class="mockup" src="' + esc(p.img) + '" alt="' + esc(p.imgAlt) + '" width="390" height="844" loading="lazy">'
      : '<pre>' + esc(p.tree) + '</pre>';
    var team = map(p.team, function (m) {
      var who = m.url ? '<a class="plain" href="' + esc(m.url) + '">' + esc(m.name) + '</a>' : esc(m.name);
      return '<div class="team-row"><span class="who">' + who + '</span><span class="did">' + esc(m.did) + '</span></div>';
    });
    var links = map(p.links, function (l) { return '<a href="' + esc(l.url) + '">' + esc(l.label) + ' ↗</a>'; });
    if (p.private) links += '<span class="muted">' + esc(p.privateLabel) + '</span>';

    return '' +
      '<li class="tl-item' + (isLast ? ' tl-last' : '') + (isOpen ? ' is-open' : '') + '" id="projet-' + esc(p.id) + '">' +
        '<span class="tl-year">' + esc(yearLabel) + '</span>' +
        '<div class="tl-rail" aria-hidden="true"><span class="tl-line"></span><span class="tl-dot"></span></div>' +
        '<article class="tl-body">' +
          '<div class="project-title"><h3>' + esc(p.name) + '</h3><span>' + esc(p.kind) + '</span></div>' +
          '<p class="project-pitch">' + esc(p.pitch) + '</p>' +
          '<ul class="techs" aria-label="' + esc(t.techLabel) + '">' + map(techs, function (x) { return '<li>' + esc(x) + '</li>'; }) + '</ul>' +
          '<button type="button" class="tl-toggle" data-project="' + esc(p.id) + '" aria-controls="panel-' + esc(p.id) + '" aria-expanded="' + isOpen + '">' +
            '<span class="label">' + esc(isOpen ? t.p.close : t.p.open) + '</span>' + CHEVRON +
            '<span class="sr-only"> ' + esc(p.name) + '</span>' +
          '</button>' +
          '<div class="project-panel" id="panel-' + esc(p.id) + '"' + (isOpen ? '' : ' hidden') + '>' +
            '<div class="details">' +
              '<div><h4>' + esc(t.p.context) + '</h4><p>' + esc(p.context) + '</p></div>' +
              (p.result ? '<div><h4>' + esc(t.p.result) + '</h4><p>' + esc(p.result) + '</p></div>' : '') +
              '<div><h4>' + esc(t.p.approach) + '</h4><ul>' + map(p.approach, function (a) { return '<li>' + esc(a) + '</li>'; }) + '</ul></div>' +
              '<div><h4>' + esc(p.teamTitle) + '</h4>' + team + '</div>' +
            '</div>' +
            '<div class="preview">' + preview + '<span class="caption">' + esc(p.previewLabel) + '</span></div>' +
            (links ? '<div class="panel-foot">' + links + '</div>' : '') +
          '</div>' +
        '</article>' +
      '</li>';
  }

  // Fil chronologique : « Aujourd'hui » en haut, puis les projets du plus récent au plus ancien.
  function renderProjects(t, projects) {
    var list = projects.filter(function (p) { return !p.inExperience; })
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
    if (state.lang === 'fr') return open ? 'Masquer les projets' : 'Projets réalisés (' + n + ')';
    return open ? 'Hide projects' : 'Projects delivered (' + n + ')';
  }

  function renderExperience(t) {
    return '' +
      '<section class="section" id="experience">' +
        '<div class="section-label"><h2>' + esc(t.nav.experience) + '</h2></div>' +
        '<div class="section-body">' + map(t.jobs, function (j, i) {
          var open = !!state.jobsOpen[i];
          return '' +
            '<article class="job a-up">' +
              '<div class="job-when"><span>' + esc(j.dates) + '</span><span>' + esc(j.place) + '</span></div>' +
              '<div class="job-body">' +
                '<div class="job-head">' +
                  '<div><h3>' + esc(j.company) + '</h3><p class="role">' + esc(j.role) + '</p></div>' +
                  (j.logoUrl ? '<div class="job-logo"><img src="' + esc(j.logoUrl) + '" alt=""></div>' : '') +
                '</div>' +
                '<ul>' + map(j.bullets, function (b) { return '<li>' + esc(b) + '</li>'; }) + '</ul>' +
                '<div class="job-projects">' +
                  '<button type="button" class="toggle small" data-job="' + i + '" aria-controls="job-' + i + '" aria-expanded="' + open + '">' +
                    '<span class="label">' + esc(jobLabel(j, i)) + '</span><span class="sign" aria-hidden="true">' + (open ? '−' : '+') + '</span>' +
                  '</button>' +
                  '<div class="job-projects-list" id="job-' + i + '"' + (open ? '' : ' hidden') + '>' +
                    map(j.projects, function (jp) {
                      return '<div class="job-project">' +
                        '<div class="jp-main"><span class="jp-name">' + esc(jp.name) + '</span><span class="jp-text">' + esc(jp.text) + '</span></div>' +
                        '<span class="jp-stack">' + esc(jp.stack) + '</span>' +
                      '</div>';
                    }) +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</article>';
        }) + '</div>' +
      '</section>';
  }

  function renderSkills(t) {
    return '' +
      '<section class="section" id="competences">' +
        '<div class="section-label"><h2>' + esc(t.nav.skills) + '</h2></div>' +
        '<div class="section-body"><div class="skills">' + map(t.skills, function (s) {
          return '<div class="a-up"><h3>' + esc(s.title) + '</h3><ul>' + map(s.items, function (i) { return '<li>' + esc(i) + '</li>'; }) + '</ul></div>';
        }) + '</div></div>' +
      '</section>';
  }

  function renderEducation(t) {
    return '' +
      '<section class="section" id="formation">' +
        '<div class="section-label"><h2>' + esc(t.nav.education) + '</h2></div>' +
        '<div class="section-body">' + map(t.education, function (e, i) {
          var open = !!state.eduOpen[i];
          return '' +
            '<div class="edu">' +
              '<span class="when">' + esc(e.dates) + '</span>' +
              '<div class="what">' +
                '<p class="name">' + esc(e.name) + '</p><p class="school">' + esc(e.school) + '</p>' +
                '<button type="button" class="tl-toggle small" data-edu="' + i + '" aria-controls="edu-' + i + '" aria-expanded="' + open + '">' +
                  '<span class="label">' + esc(open ? t.eduLess : t.eduMore) + '</span>' + CHEVRON +
                '</button>' +
                '<div class="edu-more" id="edu-' + i + '"' + (open ? '' : ' hidden') + '>' +
                  '<p>' + esc(e.more) + '</p>' +
                  '<ul class="subjects" aria-label="' + esc(t.eduSubjects) + '">' + map(e.subjects, function (s) { return '<li>' + esc(s) + '</li>'; }) + '</ul>' +
                  (e.jobs ? '<p class="edu-jobs"><span class="muted">' + esc(t.eduJobs) + ' : </span>' + esc(e.jobs) + '</p>' : '') +
                '</div>' +
              '</div>' +
            '</div>';
        }) + '</div>' +
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
        '<div class="section-body">' +
          '<dl class="rows contact-rows">' + map(rows, function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + '</dd></div>'; }) + '</dl>' +
        '</div>' +
      '</section>';
  }

  function renderFooter(t) {
    return '<span>Diego Cortes, Toulouse, 2026</span><div class="links">' + linksHtml(t, 'CV') + '</div>';
  }

  function render() {
    var content = getContent(state.lang);
    var t = content.t;
    document.documentElement.lang = t.code;
    document.title = state.lang === 'fr' ? 'Diego Cortes — Développeur full-stack' : 'Diego Cortes — Full-stack developer';
    $('#skip-link').textContent = state.lang === 'fr' ? 'Aller au contenu' : 'Skip to content';
    $('#header').innerHTML = renderHeader(t);
    $('#main').innerHTML =
      renderHero(t) + renderAbout(t) + renderEducation(t) + renderExperience(t) +
      renderSkills(t) + renderProjects(t, content.projects) + renderSeek(t) + renderContact(t);
    $('#footer').innerHTML = renderFooter(t);
    return content;
  }

  // ---------------------------------------------------------------------------
  // Interactions
  // ---------------------------------------------------------------------------
  var current = null;

  function setProjectOpen(id, open, animate) {
    var t = current.t;
    var art = document.getElementById('projet-' + id);
    if (!art) return;
    var btn = $('.tl-toggle', art);
    var panel = $('.project-panel', art);
    btn.setAttribute('aria-expanded', String(open));
    $('.label', btn).textContent = open ? t.p.close : t.p.open;
    art.classList.toggle('is-open', open);

    if (open) {
      panel.hidden = false;
      if (animate && canAnimate()) {
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'height,opacity', onComplete: refreshScroll });
        gsap.fromTo($all('.details > div, .preview', panel), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.1 });
      } else {
        refreshScroll();
      }
    } else {
      if (animate && canAnimate()) {
        gsap.to(panel, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: function () {
          panel.hidden = true; gsap.set(panel, { clearProps: 'height,opacity' }); refreshScroll();
        } });
      } else {
        panel.hidden = true;
        refreshScroll();
      }
    }
  }

  function toggleProject(id) {
    var previous = state.open;
    if (previous === id) {
      state.open = null;
      setProjectOpen(id, false, true);
      return;
    }
    if (previous) setProjectOpen(previous, false, true);
    state.open = id;
    setProjectOpen(id, true, true);
  }

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
    state.lang = lang;
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
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
  window.addEventListener('load', refreshScroll);
})();
