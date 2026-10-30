// Portfolio — Diego Cortes
// Construit la page à partir de data.js, gère les interactions et les animations (GSAP).

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Réglages : ce qui est vide n'est pas affiché.
  // ---------------------------------------------------------------------------
  var CONFIG = {
    email: 'd.cortes@me.com',
    github: 'https://github.com/diego-2909',
    linkedin: '', // ex. 'https://www.linkedin.com/in/ton-profil'
    cv: 'assets/CV-Diego-Cortes.pdf',
    photo: 'assets/diego.jpg',
    defaultOpen: 'runmates'
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    lang: initialLang(),
    open: CONFIG.defaultOpen,
    jobsOpen: {}
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
          '<a href="#projets">' + esc(t.nav.projects) + '</a>' +
          '<a href="#experience">' + esc(t.nav.experience) + '</a>' +
          '<a href="#competences">' + esc(t.nav.skills) + '</a>' +
          '<a href="#formation">' + esc(t.nav.education) + '</a>' +
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
          '<p class="lead a-words">' + esc(t.seek.lead) + '</p>' +
          '<dl class="rows">' + map(t.seek.rows, function (r) {
            return '<div class="a-up"><dt>' + esc(r.label) + '</dt><dd>' + esc(r.value) + '</dd></div>';
          }) + '</dl>' +
        '</div>' +
      '</section>';
  }

  function renderProject(p, t) {
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
      '<article class="project" id="projet-' + esc(p.id) + '" data-id="' + esc(p.id) + '">' +
        '<div class="project-head">' +
          '<span class="project-year">' + esc(p.year) + '</span>' +
          '<div class="project-main">' +
            '<div class="project-title"><h3>' + esc(p.name) + '</h3><span>' + esc(p.kind) + '</span></div>' +
            '<p class="project-pitch">' + esc(p.pitch) + '</p>' +
            '<ul class="techs" aria-label="' + esc(t.techLabel) + '">' + map(techs, function (x) { return '<li>' + esc(x) + '</li>'; }) + '</ul>' +
          '</div>' +
          '<button type="button" class="toggle" data-project="' + esc(p.id) + '" aria-controls="panel-' + esc(p.id) + '" aria-expanded="' + isOpen + '">' +
            '<span class="label">' + esc(isOpen ? t.p.close : t.p.open) + '</span><span class="sign" aria-hidden="true">' + (isOpen ? '−' : '+') + '</span>' +
            '<span class="visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"> ' + esc(p.name) + '</span>' +
          '</button>' +
        '</div>' +
        '<div class="project-panel" id="panel-' + esc(p.id) + '"' + (isOpen ? '' : ' hidden') + '>' +
          '<div class="preview">' + preview + '<span class="caption">' + esc(p.previewLabel) + '</span></div>' +
          '<div class="details">' +
            '<div><h4>' + esc(t.p.context) + '</h4><p>' + esc(p.context) + '</p></div>' +
            (p.result ? '<div><h4>' + esc(t.p.result) + '</h4><p>' + esc(p.result) + '</p></div>' : '') +
            '<div><h4>' + esc(t.p.approach) + '</h4><ul>' + map(p.approach, function (a) { return '<li>' + esc(a) + '</li>'; }) + '</ul></div>' +
            '<div><h4>' + esc(p.teamTitle) + '</h4>' + team + '</div>' +
            (links ? '<div class="panel-foot">' + links + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderProjects(t, projects) {
    return '' +
      '<section class="section" id="projets">' +
        '<div class="section-label"><h2>' + esc(t.nav.projects) + '</h2><a href="' + esc(CONFIG.github) + '?tab=repositories">github.com/diego-2909</a></div>' +
        '<div class="section-body projects">' +
          '<div class="project-list">' + map(projects, function (p) { return renderProject(p, t); }) + '</div>' +
          '<div class="now a-up"><p>' + esc(t.now.title) + '</p><div class="now-grid">' +
            map(t.now.items, function (n) { return '<div><p class="n">' + esc(n.name) + '</p><p class="t">' + esc(n.text) + '</p></div>'; }) +
          '</div></div>' +
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
                '<div><h3>' + esc(j.company) + '</h3><p class="role">' + esc(j.role) + '</p></div>' +
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
                        (jp.hasCase ? '<a class="jp-case" href="#projet-airbus" data-open="airbus">' + esc(t.seeCase) + '</a>' : '') +
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
        '<div class="section-body">' + map(t.education, function (e) {
          return '<div class="edu a-up"><span class="when">' + esc(e.dates) + '</span><div class="what"><p class="name">' + esc(e.name) + '</p><p class="school">' + esc(e.school) + '</p></div></div>';
        }) + '</div>' +
      '</section>';
  }

  function renderContact(t) {
    return '' +
      '<section class="section contact" id="contact">' +
        '<div class="section-label"><h2>' + esc(t.nav.contact) + '</h2></div>' +
        '<div class="section-body contact-body">' +
          '<p class="intro a-up">' + esc(t.contact.lead) + '</p>' +
          '<a class="mail a-mail" href="mailto:' + esc(CONFIG.email) + '">' + esc(CONFIG.email) + '</a>' +
          '<div class="links a-up">' + linksHtml(t, t.contact.cv) + '</div>' +
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
      renderHero(t) + renderAbout(t) + renderSeek(t) + renderProjects(t, content.projects) +
      renderExperience(t) + renderSkills(t) + renderEducation(t) + renderContact(t);
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
    var btn = $('.toggle', art);
    var panel = $('.project-panel', art);
    btn.setAttribute('aria-expanded', String(open));
    $('.label', btn).textContent = open ? t.p.close : t.p.open;
    $('.sign', btn).textContent = open ? '−' : '+';

    if (open) {
      panel.hidden = false;
      if (animate && canAnimate()) {
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'height,opacity', onComplete: refreshScroll });
        gsap.fromTo($('.preview', panel), { rotateY: -28, x: -24, opacity: 0, transformPerspective: 900 }, { rotateY: 0, x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 });
        gsap.fromTo($all('.details > div', panel), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.15 });
      } else {
        refreshScroll();
      }
      setupMockupTilt(panel);
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
    if (el.dataset.open) {
      if (state.open !== el.dataset.open) toggleProject(el.dataset.open);
    }
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

  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var words = el.textContent.split(/(\s+)/);
    el.setAttribute('aria-label', el.textContent);
    el.innerHTML = words.map(function (w) {
      return /^\s+$/.test(w) ? w : '<span class="w" aria-hidden="true" style="display:inline-block">' + esc(w) + '</span>';
    }).join('');
  }

  function setupMockupTilt(scope) {
    if (!canScrollAnimate()) return;
    $all('img.mockup', scope).forEach(function (img) {
      if (img.dataset.tilt) return;
      img.dataset.tilt = '1';
      gsap.fromTo(img,
        { rotateY: -16, rotateX: 10, transformPerspective: 1000, transformOrigin: '50% 50%' },
        { rotateY: 12, rotateX: -6, ease: 'none',
          scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });
  }

  function setupAnimations(entrance) {
    if (!canScrollAnimate()) return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Haut de page
    if (entrance) {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.a-hero', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 })
        .from('.portrait img', { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12, duration: 1.1, ease: 'power4.out' }, 0.1)
        .from('.portrait figcaption', { opacity: 0, duration: 0.6 }, 0.6)
        .from('.site-header > *', { y: -10, opacity: 0, duration: 0.6, stagger: 0.08 }, 0);
    }

    // 2. Phrases d'accroche : les mots s'allument au fil du scroll
    $all('.a-words').forEach(function (el) {
      splitWords(el);
      gsap.fromTo($all('.w', el), { opacity: 0.14 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: true }
      });
    });

    // 3. Titres de section et blocs simples
    $all('.section-label').forEach(function (el) {
      gsap.from(el, { x: -16, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    ScrollTrigger.batch('.a-up', {
      start: 'top 92%', once: true,
      onEnter: function (batch) {
        gsap.from(batch, { y: 22, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out', overwrite: true });
      }
    });

    // 4. Projets : chaque ligne bascule en 3D en arrivant à l'écran
    var list = $('.project-list');
    if (list) gsap.set(list, { perspective: 1400 });
    $all('.project').forEach(function (row) {
      gsap.fromTo(row,
        { rotateX: -32, y: 48, opacity: 0, transformOrigin: '50% 0%' },
        { rotateX: 0, y: 0, opacity: 1, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 98%', end: 'top 72%', scrub: 0.6 } });
    });
    setupMockupTilt(document);

    // 5. Adresse e-mail : légère montée en échelle
    gsap.from('.a-mail', { scale: 0.92, opacity: 0, transformOrigin: '0% 50%', duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.a-mail', start: 'top 92%', once: true } });

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
