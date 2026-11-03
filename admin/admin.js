// Page d'administration des liens de candidature (diego-cortes.dev/admin/).
// Connexion avec le compte Supabase de Diego, création des liens, suivi des visites.

(function () {
  'use strict';

  var cfg = window.PORTFOLIO_CONFIG || {};
  var app = document.getElementById('app');
  var logoutBtn = document.getElementById('logout');
  var SITE = location.origin; // ex. https://diego-cortes.dev

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function linkUrl(code) { return SITE + '/' + code; }
  var CODE_RE = /^[a-z0-9][a-z0-9-]{1,19}$/;
  var RESERVED = ['admin', 'assets', 'balade', 'balade2'];
  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ', ' +
      d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  function newCode() {
    var chars = 'abcdefghijkmnpqrstuvwxyz23456789'; // sans 0/o, 1/l : lisible à l'oral
    var bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.prototype.map.call(bytes, function (b) { return chars[b % chars.length]; }).join('');
  }
  function copy(text, btn) {
    var done = function () {
      var old = btn.textContent;
      btn.textContent = 'Copié';
      setTimeout(function () { btn.textContent = old; }, 1500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copier le lien :', text); });
    else window.prompt('Copier le lien :', text);
  }

  // Noms des projets, pour afficher « RunMates » plutôt que « runmates ».
  var projectNames = {};
  try {
    getContent('fr').projects.forEach(function (p) { projectNames[p.id] = p.name; });
  } catch (e) { /* data.js indisponible : on affiche les identifiants */ }

  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
    app.innerHTML =
      '<h1>Configuration manquante</h1>' +
      '<p class="muted">Renseigne l\'URL du projet et la clé « anon public » de Supabase dans <code>config.js</code>, à la racine du site.</p>';
    return;
  }

  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  // ---------------------------------------------------------------------------
  // Connexion
  // ---------------------------------------------------------------------------
  function showLogin(message) {
    logoutBtn.hidden = true;
    app.innerHTML =
      '<section class="card">' +
        '<h1>Connexion</h1>' +
        '<p class="muted" style="margin-bottom:20px">Réservé à Diego.</p>' +
        '<form id="login">' +
          '<div class="field"><label for="email">E-mail</label><input id="email" type="email" autocomplete="username" required></div>' +
          '<div class="field"><label for="password">Mot de passe</label><input id="password" type="password" autocomplete="current-password" required></div>' +
          '<button class="btn" type="submit">Se connecter</button>' +
        '</form>' +
        '<p class="msg error" id="login-msg">' + esc(message || '') + '</p>' +
      '</section>';
    document.getElementById('login').addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = e.target.querySelector('button');
      btn.disabled = true;
      sb.auth.signInWithPassword({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      }).then(function (res) {
        btn.disabled = false;
        if (res.error) { document.getElementById('login-msg').textContent = 'E-mail ou mot de passe incorrect.'; return; }
        showDashboard();
      });
    });
  }

  logoutBtn.addEventListener('click', function () {
    sb.auth.signOut().then(function () { showLogin(); });
  });

  // ---------------------------------------------------------------------------
  // Tableau de bord
  // ---------------------------------------------------------------------------
  var state = { links: [], visits: [], lastCreated: null, confirmDelete: null, history: {} };

  function fmtDay(iso) {
    var d = new Date(iso);
    var s = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function fmtTime(iso) { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }

  // Historique d'un lien : une visite par session, avec l'heure de chaque action.
  function renderHistory(link) {
    var vs = state.visits.filter(function (v) { return v.link_id === link.id; }).slice().reverse(); // du plus ancien au plus récent
    if (!vs.length) return '<p class="muted">Aucune visite pour l\'instant.</p>';
    var bySession = {}, order = [];
    vs.forEach(function (v) {
      if (!bySession[v.session_id]) { bySession[v.session_id] = []; order.push(v.session_id); }
      bySession[v.session_id].push(v);
    });
    return '<ol class="hist-list">' + order.slice().reverse().map(function (sid, i) {
      var evs = bySession[sid], opens = 0;
      var first = evs[0].created_at, last = evs[evs.length - 1].created_at;
      var mins = Math.round((new Date(last) - new Date(first)) / 60000);
      var items = evs.map(function (v) {
        var label;
        if (v.event === 'open') label = opens++ ? 'Revient sur la page' : 'Ouvre le portfolio';
        else if (v.event === 'project') label = 'Consulte le projet ' + (projectNames[v.detail] || v.detail || '');
        else if (v.event === 'cv') label = 'Télécharge le CV';
        else if (v.event === 'lang') label = 'Passe en ' + (v.detail === 'en' ? 'anglais' : 'français');
        else label = v.event;
        return '<li><time>' + fmtTime(v.created_at) + '</time><span>' + esc(label) + '</span></li>';
      }).join('');
      return '<li class="hist-visit"><p class="hist-head"><strong>Visite ' + (order.length - i) + '</strong> · ' + fmtDay(first) +
        (mins >= 1 ? ' <span class="muted">· ' + mins + ' min</span>' : '') + '</p><ul>' + items + '</ul></li>';
    }).join('') + '</ol>';
  }

  function summarize(link) {
    var vs = state.visits.filter(function (v) { return v.link_id === link.id; });
    var opens = vs.filter(function (v) { return v.event === 'open'; });
    var sessions = {};
    opens.forEach(function (v) { sessions[v.session_id] = true; });
    var projects = [];
    vs.forEach(function (v) {
      if (v.event === 'project' && v.detail && projects.indexOf(v.detail) === -1) projects.push(v.detail);
    });
    var last = vs.length ? vs[0].created_at : null; // visites triées de la plus récente à la plus ancienne
    var first = opens.length ? opens[opens.length - 1].created_at : null;
    return {
      opened: opens.length > 0,
      visits: Object.keys(sessions).length,
      first: first,
      last: last,
      projects: projects,
      cv: vs.some(function (v) { return v.event === 'cv'; }),
      en: vs.some(function (v) { return v.event === 'lang' && v.detail === 'en'; })
    };
  }

  function renderDashboard() {
    var rows = state.links.map(function (l) {
      var s = summarize(l);
      var seen = s.projects.map(function (id) { return '<span class="chip">' + esc(projectNames[id] || id) + '</span>'; }).join('');
      if (s.cv) seen += '<span class="chip cv">CV téléchargé</span>';
      if (s.en) seen += '<span class="chip">Version anglaise</span>';
      var confirming = state.confirmDelete === l.id;
      return '' +
        '<tr>' +
          '<td><strong>' + esc(l.company) + '</strong>' + (l.note ? '<span class="sub">' + esc(l.note) + '</span>' : '') + '</td>' +
          '<td>' + fmtDate(l.created_at) + '</td>' +
          '<td><span class="status' + (s.opened ? ' open' : '') + '">' + (s.opened ? 'Ouvert' : 'Pas encore') + '</span>' +
            (s.opened ? '<span class="sub">1re fois : ' + fmtDate(s.first) + '</span>' : '') + '</td>' +
          '<td>' + (s.visits || '—') + '</td>' +
          '<td>' + (s.last ? fmtDate(s.last) : '—') + '</td>' +
          '<td>' + (seen ? '<div class="chips">' + seen + '</div>' : '<span class="muted">—</span>') + '</td>' +
          '<td class="code">' + esc(l.code) + '</td>' +
          '<td><div class="actions">' +
            '<button type="button" class="btn ghost small' + (state.history[l.id] ? ' on' : '') + '" data-history="' + esc(l.id) + '" aria-expanded="' + !!state.history[l.id] + '">Historique</button>' +
            '<button type="button" class="btn ghost small" data-copy="' + esc(l.code) + '">Copier</button>' +
            '<button type="button" class="btn danger small' + (confirming ? ' confirm' : '') + '" data-delete="' + esc(l.id) + '">' + (confirming ? 'Confirmer' : 'Supprimer') + '</button>' +
          '</div></td>' +
        '</tr>' +
        (state.history[l.id] ? '<tr class="hist"><td colspan="8">' + renderHistory(l) + '</td></tr>' : '');
    }).join('');

    var opened = state.links.filter(function (l) { return summarize(l).opened; }).length;
    var created = state.lastCreated
      ? '<div class="newlink"><code>' + esc(linkUrl(state.lastCreated.code)) + '</code>' +
        '<button type="button" class="btn small" data-copy="' + esc(state.lastCreated.code) + '">Copier le lien</button>' +
        '<span class="muted" style="font-size:13px">Lien pour ' + esc(state.lastCreated.company) + '</span></div>'
      : '';

    app.innerHTML =
      '<section class="card">' +
        '<h1>Nouveau lien</h1>' +
        '<p class="muted" style="margin-bottom:18px">Un lien par candidature. Colle-le dans ta lettre, ton mail ou ton message LinkedIn.</p>' +
        '<form id="create">' +
          '<div class="field"><label for="company">Entreprise</label><input id="company" required maxlength="120" placeholder="ex. Capgemini"></div>' +
          '<div class="field"><label for="code">Code du lien (facultatif)</label><input id="code" maxlength="20" placeholder="ex. cg → diego-cortes.dev/cg" autocapitalize="off" autocomplete="off" spellcheck="false"></div>' +
          '<div class="field"><label for="note">Note (facultatif)</label><input id="note" maxlength="500" placeholder="ex. Dev full-stack, via Welcome to the Jungle"></div>' +
          '<button class="btn" type="submit">Générer le lien</button>' +
        '</form>' +
        '<p class="msg error" id="create-msg"></p>' +
        created +
      '</section>' +
      '<section class="card">' +
        '<div class="toolbar"><h2>Suivi</h2>' +
          '<div class="stats"><span><strong>' + state.links.length + '</strong> liens</span><span><strong>' + opened + '</strong> ouverts</span>' +
          '<button type="button" class="btn ghost small" id="refresh">Actualiser</button></div>' +
        '</div>' +
        (state.links.length
          ? '<div class="table-wrap"><table><thead><tr><th>Entreprise</th><th>Créé</th><th>Statut</th><th>Visites</th><th>Dernière activité</th><th>A consulté</th><th>Code</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
          : '<p class="empty">Aucun lien pour l\'instant. Crée le premier au-dessus.</p>') +
      '</section>';

    document.getElementById('create').addEventListener('submit', onCreate);
    document.getElementById('refresh').addEventListener('click', load);
  }

  function onCreate(e) {
    e.preventDefault();
    var btn = e.target.querySelector('button');
    var company = document.getElementById('company').value.trim();
    var note = document.getElementById('note').value.trim();
    var chosen = document.getElementById('code').value.trim().toLowerCase();
    var msg = document.getElementById('create-msg');
    msg.textContent = '';
    if (!company) return;
    if (chosen && (!CODE_RE.test(chosen) || RESERVED.indexOf(chosen) !== -1)) {
      msg.textContent = 'Code invalide : 2 à 20 caractères, lettres minuscules, chiffres ou tirets (et pas « admin », « assets », « balade » ni « balade2 »).';
      return;
    }
    btn.disabled = true;
    var attempt = 0;
    (function tryInsert() {
      var code = chosen || newCode();
      sb.from('links').insert({ code: code, company: company, note: note || null }).select().single().then(function (res) {
        if (res.error && res.error.code === '23505' && !chosen && attempt++ < 3) return tryInsert(); // code tiré au sort déjà pris : on en tire un autre
        btn.disabled = false;
        if (res.error && res.error.code === '23505') { msg.textContent = 'Ce code est déjà utilisé par un autre lien. Choisis-en un autre.'; return; }
        if (res.error && res.error.code === '23514') { msg.textContent = 'Code refusé par la base. As-tu exécuté supabase/migration-codes-courts.sql ?'; return; }
        if (res.error) { msg.textContent = 'Impossible de créer le lien : ' + res.error.message; return; }
        state.lastCreated = res.data;
        load();
      });
    })();
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.copy) { copy(linkUrl(b.dataset.copy), b); return; }
    if (b.dataset.history) { state.history[b.dataset.history] = !state.history[b.dataset.history]; renderDashboard(); return; }
    if (b.dataset.delete) {
      var id = b.dataset.delete;
      if (state.confirmDelete !== id) { state.confirmDelete = id; renderDashboard(); return; }
      sb.from('links').delete().eq('id', id).then(function () {
        state.confirmDelete = null;
        if (state.lastCreated && state.lastCreated.id === id) state.lastCreated = null;
        load();
      });
    }
  });

  function load() {
    return Promise.all([
      sb.from('links').select('*').order('created_at', { ascending: false }),
      sb.from('visits').select('link_id, session_id, event, detail, created_at').order('created_at', { ascending: false }).limit(10000)
    ]).then(function (res) {
      if (res[0].error || res[1].error) {
        app.innerHTML = '<h1>Accès refusé</h1><p class="muted">Ce compte n\'a pas accès aux liens. Vérifie l\'adresse e-mail indiquée dans <code>supabase/schema.sql</code>.</p>';
        return;
      }
      state.links = res[0].data || [];
      state.visits = res[1].data || [];
      renderDashboard();
    });
  }

  function showDashboard() {
    logoutBtn.hidden = false;
    app.innerHTML = '<p class="muted">Chargement…</p>';
    load();
  }

  sb.auth.getSession().then(function (res) {
    if (res.data && res.data.session) showDashboard(); else showLogin();
  });
})();
