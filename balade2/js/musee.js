// Le musée : le portfolio de Diego, à visiter salle par salle.
// Tout le contenu vient de /data.js (getContent), comme sur le site.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = (id) => document.getElementById(id);
const TOUCH = matchMedia('(pointer: coarse)').matches;
const lerp = THREE.MathUtils.lerp, clamp = THREE.MathUtils.clamp;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const DATA = getContent('fr'), T = DATA.t, PROJECTS = DATA.projects;
const ME = { email: 'd.cortes@me.com', phone: '+33626573074', phoneLabel: '+33 6 26 57 30 74', github: 'https://github.com/diego-2909', cv: '/assets/CV-Diego-Cortes.pdf' };
const proj = (id) => PROJECTS.find((p) => p.id === id);

// ---------------------------------------------------------------------------
// Plan du musée : une longue galerie, découpée en salles
// ---------------------------------------------------------------------------
const W = 8, H = 5.4, Z_START = 6, Z_END = -106;
const ROOMS = [
  { id: 'accueil', n: '01', title: 'Accueil', z0: 6, z1: -10, accent: '#141414' },
  { id: 'airbus', n: '02', title: 'Airbus Operations', z0: -10, z1: -28, accent: '#00205B' },
  { id: 'andil', n: '03', title: 'Andil', z0: -28, z1: -44, accent: '#E2582A' },
  { id: 'formation', n: '04', title: 'Formation', z0: -44, z1: -62, accent: '#1F7A45' },
  { id: 'projets', n: '05', title: 'Projets', z0: -62, z1: -84, accent: '#C2410C' },
  { id: 'competences', n: '06', title: 'Compétences', z0: -84, z1: -96, accent: '#55349A' },
  { id: 'contact', n: '07', title: 'Contact', z0: -96, z1: -106, accent: '#141414' }
];
const mid = (r) => (r.z0 + r.z1) / 2;
const R = Object.fromEntries(ROOMS.map((r) => [r.id, r]));

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------
const canvas = $('scene');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { $('loading').hidden = true; $('error').hidden = false; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, TOUCH ? 1.5 : 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe9e6df);
scene.fog = new THREE.Fog(0xe9e6df, 30, 70);
const camera = new THREE.PerspectiveCamera(innerWidth < innerHeight ? 70 : 58, innerWidth / innerHeight, 0.05, 200);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.4;
scene.add(new THREE.HemisphereLight(0xfffaf2, 0xb8b0a2, 0.55));
const key = new THREE.DirectionalLight(0xfff4e6, 1.3);
key.castShadow = true; key.shadow.mapSize.set(TOUCH ? 1024 : 2048, TOUCH ? 1024 : 2048);
Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 40 });
key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02;
scene.add(key, key.target);

const solids = []; // boîtes de collision { x0, x1, z0, z1 }
const occluders = []; // murs, pour que la caméra ne passe pas au travers
const spots = []; // points d'intérêt
const animated = []; // fonctions (t, dt)

// ---------------------------------------------------------------------------
// Textures et matériaux
// ---------------------------------------------------------------------------
function rnd(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function concrete() {
  const N = 1024, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'), r = rnd(4);
  g.fillStyle = '#b9b4ab'; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 9000; i++) { const v = 150 + r() * 70; g.fillStyle = `rgba(${v},${v - 4},${v - 10},${0.05 + r() * 0.08})`; const s = 2 + r() * 26; g.fillRect(r() * N, r() * N, s, s); }
  for (let i = 0; i < 40; i++) { const v = 120 + r() * 80; g.fillStyle = `rgba(${v},${v},${v - 8},0.06)`; g.beginPath(); g.ellipse(r() * N, r() * N, 40 + r() * 160, 30 + r() * 120, r() * 3, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(70,66,60,.35)'; g.lineWidth = 2; // joints de dalles tous les 2 m
  for (let k = 0; k <= 2; k++) { g.beginPath(); g.moveTo(k * N / 2, 0); g.lineTo(k * N / 2, N); g.stroke(); g.beginPath(); g.moveTo(0, k * N / 2); g.lineTo(N, k * N / 2); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}
const M = {
  wall: new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.92 }),
  plinth: new THREE.MeshStandardMaterial({ color: 0xfbfaf7, roughness: 0.6 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.5 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.4, metalness: 0.3 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xd7dade, metalness: 1, roughness: 0.18 }),
  glow: new THREE.MeshBasicMaterial({ color: 0xffffff })
};

function box(w, h, d, mat, x, y, z, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function solid(x0, x1, z0, z1) { solids.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1) }); }

// ---------------------------------------------------------------------------
// Texte sur canvas : panneaux, cartels, étiquettes
// ---------------------------------------------------------------------------
const FONT = 'Geist, "Helvetica Neue", Arial, sans-serif', MONO = '"Geist Mono", ui-monospace, monospace';
function wrap(g, text, x, y, maxW, lh, maxLines = 99) {
  const words = String(text).split(/\s+/); let line = '', n = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (g.measureText(test).width > maxW && line) {
      if (n === maxLines - 1) { while (g.measureText(line + '…').width > maxW) line = line.slice(0, -1); g.fillText(line + '…', x, y); return y + lh; }
      g.fillText(line, x, y); y += lh; n++; line = words[i];
    } else line = test;
  }
  if (line) { g.fillText(line, x, y); y += lh; }
  return y;
}
const imgCache = {};
function loadImg(src) { return imgCache[src] || (imgCache[src] = new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; })); }

// Un panneau d'exposition : titre, sous-titre, texte, puces, étiquettes
function panelTexture(o) {
  const PX = Math.max(270, 980 / o.w), w = Math.round(o.w * PX), h = Math.round(o.h * PX);
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = o.bg || '#FAFAF8'; g.fillRect(0, 0, w, h);
  g.fillStyle = o.accent || '#141414'; g.fillRect(0, 0, w, 14);
  const pad = 64; let y = pad + 20;
  g.textBaseline = 'top';
  if (o.logo) { const lw = Math.min(o.logo.width * (70 / o.logo.height), w * 0.4); g.drawImage(o.logo, pad, y, lw, lw * o.logo.height / o.logo.width); y += lw * o.logo.height / o.logo.width + 34; }
  if (o.kicker) { g.fillStyle = '#6B6B66'; g.font = `400 28px ${MONO}`; g.fillText(o.kicker.toUpperCase(), pad, y); y += 52; }
  if (o.title) { g.fillStyle = '#141414'; g.font = `500 ${o.titleSize || 64}px ${FONT}`; y = wrap(g, o.title, pad, y, w - pad * 2, (o.titleSize || 64) * 1.12, 3) + 10; }
  if (o.sub) { g.fillStyle = '#55554F'; g.font = `400 32px ${FONT}`; y = wrap(g, o.sub, pad, y, w - pad * 2, 44, 3) + 24; }
  g.fillStyle = '#2E2E2A'; g.font = `400 ${o.bodySize || 30}px ${FONT}`;
  const lh = (o.bodySize || 30) * 1.5;
  (o.body || []).forEach((p) => { if (y < h - pad - lh) y = wrap(g, p, pad, y, w - pad * 2, lh, Math.max(1, Math.floor((h - pad - y) / lh))) + 18; });
  (o.bullets || []).forEach((b) => {
    if (y > h - pad - lh) return;
    g.fillStyle = o.accent || '#141414'; g.beginPath(); g.arc(pad + 7, y + lh / 2 - 4, 6, 0, 7); g.fill();
    g.fillStyle = '#2E2E2A'; y = wrap(g, b, pad + 30, y, w - pad * 2 - 30, lh, 2) + 8;
  });
  if (o.chips && o.chips.length) {
    y += 10; let x = pad; g.font = `400 26px ${FONT}`;
    o.chips.forEach((ch) => {
      const tw = g.measureText(ch).width + 36;
      if (x + tw > w - pad) { x = pad; y += 54; }
      if (y > h - pad - 40) return;
      g.fillStyle = ch.color || '#EFEFEA'; roundRect(g, x, y, tw, 42, 21); g.fill();
      g.fillStyle = '#2E2E2A'; g.fillText(ch.label || ch, x + 18, y + 8); x += tw + 12;
    });
  }
  if (o.footer) { g.fillStyle = '#6B6B66'; g.font = `400 26px ${MONO}`; g.fillText(o.footer, pad, h - pad); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// Accroche un panneau au mur gauche (side -1) ou droit (+1), centré en z
function wallPanel(side, z, o, y = 2.15) {
  const grp = new THREE.Group();
  const frame = box(o.w + 0.08, o.h + 0.08, 0.05, M.frame, 0, 0, -0.03, grp); frame.castShadow = false;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.h), new THREE.MeshBasicMaterial({ map: panelTexture(o), color: 0xf2f2f2 }));
  face.position.z = 0.002; grp.add(face);
  grp.position.set(side * (W - 0.06), y, z); grp.rotation.y = -side * Math.PI / 2;
  scene.add(grp);
  return grp;
}

// Un cartel posé sur pied (comme devant une œuvre)
function standPanel(x, z, rotY, o) {
  const grp = new THREE.Group(); grp.position.set(x, 0, z); grp.rotation.y = rotY; scene.add(grp);
  box(0.05, 1.0, 0.05, M.chrome, 0, 0.5, 0, grp);
  box(0.4, 0.02, 0.3, M.chrome, 0, 0.01, 0, grp);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.h), new THREE.MeshBasicMaterial({ map: panelTexture(o), color: 0xf2f2f2 }));
  face.position.set(0, 1.05 + o.h / 2 * Math.cos(0.5), 0.03); face.rotation.x = -0.5; grp.add(face);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(o.w + 0.04, o.h + 0.04), M.frame); back.position.copy(face.position); back.position.z -= 0.012; back.rotation.x = -0.5; grp.add(back);
  return grp;
}

function spotlight(x, y, z, tx, ty, tz, intensity = 40, angle = 0.5) {
  const s = new THREE.SpotLight(0xfff1dc, intensity, 14, angle, 0.5, 1.6);
  s.position.set(x, y, z); s.target.position.set(tx, ty, tz); scene.add(s, s.target);
  const fix = box(0.16, 0.22, 0.16, M.dark, x, y + 0.05, z); fix.castShadow = false;
  return s;
}

function addSpot(o) { spots.push(Object.assign({ r: 2.6, visited: false }, o)); }

// ---------------------------------------------------------------------------
// Le bâtiment
// ---------------------------------------------------------------------------
function building() {
  const len = Z_START - Z_END, cz = (Z_START + Z_END) / 2;
  const floorTex = concrete(); floorTex.repeat.set(W, len / 2);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, len), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.38, metalness: 0.02 }));
  floor.rotation.x = -Math.PI / 2; floor.position.z = cz; floor.receiveShadow = true; scene.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, len), new THREE.MeshStandardMaterial({ color: 0xdedbd4, roughness: 1 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, cz); scene.add(ceil);
  // Murs
  for (const s of [-1, 1]) { const m = box(0.3, H, len, M.wall, s * (W + 0.15), H / 2, cz); m.castShadow = false; occluders.push(m); solid(s * W, s * (W + 1), Z_START, Z_END); }
  const endWall = box(W * 2, H, 0.3, M.wall, 0, H / 2, Z_END - 0.15); occluders.push(endWall); solid(-W, W, Z_END, Z_END - 1);
  const startWall = box(W * 2, H, 0.3, M.wall, 0, H / 2, Z_START + 0.15); occluders.push(startWall); solid(-W, W, Z_START, Z_START + 1);
  // Plinthe noire en bas des murs
  for (const s of [-1, 1]) box(0.02, 0.12, len, M.dark, s * (W - 0.01), 0.06, cz).castShadow = false;
  // Rampes lumineuses au plafond
  for (const x of [-3.2, 3.2]) { const l = box(0.18, 0.04, len - 2, M.glow, x, H - 0.03, cz); l.castShadow = false; }
  // Bandeau de couleur de chaque salle, le long des deux murs
  ROOMS.forEach((room) => {
    const m = new THREE.MeshStandardMaterial({ color: room.accent, roughness: 0.8 });
    for (const sd of [-1, 1]) box(0.02, 0.5, room.z0 - room.z1 - 0.4, m, sd * (W - 0.012), H - 0.6, mid(room)).castShadow = false;
  });
  // Cloisons entre les salles, avec le nom de la salle au-dessus du passage
  ROOMS.slice(1).forEach((room) => {
    const z = room.z0;
    for (const s of [-1, 1]) { const m = box(W - 2.6, H, 0.3, M.wall, s * (W + 2.6) / 2, H / 2, z); occluders.push(m); solid(s * 2.6, s * W, z - 0.15, z + 0.15); }
    const lintel = box(5.2, H - 3.4, 0.3, M.wall, 0, 3.4 + (H - 3.4) / 2, z); occluders.push(lintel);
    for (const face of [1, -1]) {
      const t = panelTexture({ w: 5, h: 1.2, accent: room.accent, kicker: face > 0 ? 'Salle ' + room.n : 'Retour', title: face > 0 ? room.title : (ROOMS[ROOMS.indexOf(room) - 1].title), titleSize: 110, bg: '#F2F0EB' });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.1), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, color: 0xf0f0f0 }));
      sign.position.set(0, 4.25, z + face * 0.16); if (face < 0) sign.rotation.y = Math.PI; scene.add(sign);
    }
  });
}

// ---------------------------------------------------------------------------
// Les œuvres
// ---------------------------------------------------------------------------
function plinth(x, z, w, h, d, round = false) {
  const g = round ? new THREE.CylinderGeometry(w / 2, w / 2, h, 48) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, M.plinth); m.position.set(x, h / 2, z); m.castShadow = m.receiveShadow = true; scene.add(m);
  solid(x - w / 2 - 0.05, x + w / 2 + 0.05, z - (round ? w : d) / 2 - 0.05, z + (round ? w : d) / 2 + 0.05);
  return m;
}

// Maquette d'A320, à l'échelle 1/20, en mètres réels puis réduite
function a320() {
  const plane = new THREE.Group();
  const paint = new THREE.MeshPhysicalMaterial({ color: 0xf6f7f8, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const navy = new THREE.MeshPhysicalMaterial({ color: 0x0b2a6b, roughness: 0.35, clearcoat: 0.7 });
  const grey = new THREE.MeshStandardMaterial({ color: 0xc4c8ce, metalness: 0.6, roughness: 0.35 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.15, metalness: 0.5 });
  // Fuselage (profil tourné autour de l'axe), du nez (z=0) à la queue (z=37.6)
  const prof = [];
  for (let i = 0; i <= 40; i++) {
    const zz = (i / 40) * 37.6; let r;
    if (zz < 6) r = 1.98 * Math.sqrt(1 - Math.pow(1 - zz / 6, 2.2));
    else if (zz < 27) r = 1.98;
    else r = 1.98 - (1.98 - 0.32) * Math.pow((zz - 27) / 10.6, 1.4);
    prof.push(new THREE.Vector2(Math.max(r, 0.001), zz));
  }
  const fus = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), paint);
  fus.rotation.x = Math.PI / 2; plane.add(fus); // l'axe y du tour devient l'axe z
  // Hublots et vitres du cockpit
  const win = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.28, 0.22), glass, 120);
  const d = new THREE.Object3D(); let n = 0;
  for (const s of [-1, 1]) for (let zz = 7.4; zz < 29.5; zz += 0.53) { if (Math.abs(zz - 11.5) < 0.6 || Math.abs(zz - 24.2) < 0.6) continue; d.position.set(s * 1.96, 0.45, zz); d.updateMatrix(); win.setMatrixAt(n++, d.matrix); }
  win.count = n; plane.add(win);
  for (const s of [-1, 1]) { const cw = box(0.9, 0.42, 0.06, glass, s * 0.62, 0.9, 1.75, plane); cw.rotation.set(-0.9, s * 0.55, 0); cw.castShadow = false; }
  // Ailes : trapèze en flèche, avec dièdre
  const wing = (span, rootC, tipC, sweepDeg, thick) => {
    const sh = new THREE.Shape(), sw = Math.tan(THREE.MathUtils.degToRad(sweepDeg)) * span;
    sh.moveTo(0, 0); sh.lineTo(span, sw); sh.lineTo(span, sw + tipC); sh.lineTo(0, rootC); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.4, bevelSize: thick * 0.4, bevelSegments: 2 });
    g.rotateX(Math.PI / 2); g.translate(0, thick / 2, 0); // la forme passe dans le plan horizontal (x, z)
    return g;
  };
  for (const s of [-1, 1]) {
    const wg = new THREE.Mesh(wing(15.9, 6.6, 1.6, 27, 0.3), paint);
    wg.position.set(s * 1.7, -1.05, 12.2); wg.scale.x = s; wg.rotation.z = s * THREE.MathUtils.degToRad(5); plane.add(wg);
    const sharklet = new THREE.Mesh(wing(2.3, 1.4, 0.5, 40, 0.12), navy);
    sharklet.position.set(s * 17.5, 0.35, 12.2 + 8.1); sharklet.rotation.z = s * Math.PI / 2; sharklet.scale.x = s; plane.add(sharklet);
    // Réacteur sous l'aile
    const eng = new THREE.Group(); eng.position.set(s * 5.75, -2.35, 11.4); plane.add(eng);
    const nac = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.78, 4.3, 32, 1, true), grey); nac.rotation.x = Math.PI / 2; eng.add(nac);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.09, 12, 32), M.chrome); lip.position.z = -2.15; eng.add(lip);
    const fan = new THREE.Mesh(new THREE.CircleGeometry(0.92, 32), M.dark); fan.position.z = -2.0; fan.rotation.y = Math.PI; eng.add(fan);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.6, 20), grey); cone.rotation.x = -Math.PI / 2; cone.position.z = -2.1; eng.add(cone);
    const pylon = box(0.35, 1.2, 3.6, paint, 0, 0.95, 0.6, eng); pylon.castShadow = true;
    // Empennage horizontal
    const hs = new THREE.Mesh(wing(6.1, 3.6, 1.4, 30, 0.16), paint);
    hs.position.set(s * 0.5, 0.55, 31.6); hs.scale.x = s; hs.rotation.z = s * THREE.MathUtils.degToRad(6); plane.add(hs);
  }
  // Dérive, aux couleurs bleu nuit
  const fin = new THREE.Mesh(wing(6.2, 5.8, 2.1, 36, 0.18), navy);
  fin.rotation.z = Math.PI / 2; fin.position.set(0, 1.5, 30.2); plane.add(fin);
  // Ventre gris clair
  const belly = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 6.5), grey); belly.position.set(0, -1.75, 15.2); plane.add(belly);
  plane.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  // centrer : le milieu de la maquette au-dessus du socle, nez vers l'avant
  const holder = new THREE.Group(); plane.position.z = -18.8; holder.add(plane);
  holder.scale.setScalar(1 / 12);
  return holder;
}

function mortarboard(color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75 });
  const skull = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.12, 32), mat); skull.position.y = 0.06; g.add(skull);
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.016, 0.36), mat); board.position.y = 0.128; board.rotation.y = Math.PI / 4; g.add(board);
  const gold = new THREE.MeshStandardMaterial({ color: 0xd4a640, metalness: 0.7, roughness: 0.3 });
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.012, 12), gold); btn.position.y = 0.142; g.add(btn);
  const cord = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.006, 0.24), gold); cord.position.set(0, 0.139, 0.12); g.add(cord);
  const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.028, 0.11, 10), gold); tassel.position.set(0, 0.085, 0.245); g.add(tassel);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

// Écran qui affiche une image ou une vidéo
function screen(w, h, map, x, y, z, rotY, parent = scene) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; parent.add(g);
  box(w + 0.08, h + 0.08, 0.06, M.dark, 0, 0, -0.035, g);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, toneMapped: false })); s.position.z = 0.001; g.add(s);
  return g;
}

function cubeLabel(text, color) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = color; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 6; g.strokeRect(3, 3, 250, 250);
  g.fillStyle = '#1f2328'; g.textAlign = 'center'; g.textBaseline = 'middle';
  let size = 44; g.font = `500 ${size}px ${FONT}`;
  const words = text.split(/,\s*|\s+(?=\S{6,})/);
  while (size > 22 && words.some((w) => g.measureText(w).width > 220)) { size -= 2; g.font = `500 ${size}px ${FONT}`; }
  const lh = size * 1.15, y0 = 128 - ((words.length - 1) * lh) / 2;
  words.forEach((w, i) => g.fillText(w, 128, y0 + i * lh));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------------------------------------------------------------------------
// Fiches détaillées (HTML), ouvertes en lisant un panneau
// ---------------------------------------------------------------------------
const chipsHtml = (list) => '<ul class="chips">' + list.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul>';
function projectHtml(p, fallback) {
  if (!p) return `<p class="kicker">Projet</p><h2 id="sheet-title">${esc(fallback.name)}</h2><p>${esc(fallback.text)}</p>${chipsHtml(fallback.stack.split(' · '))}`;
  let h = `<p class="kicker">${esc(p.year)} · ${esc(p.kind)}</p><h2 id="sheet-title">${esc(p.name)}</h2><p class="sub">${esc(p.pitch)}</p>${chipsHtml(p.stack.split(' · '))}`;
  [].concat(p.context || []).forEach((c, i) => { if (c) h += (i === 0 ? `<h3>${esc(T.p.context)}</h3>` : '') + `<p>${esc(c)}</p>`; });
  if (p.approachText) h += `<h3>${esc(p.approachTitle || T.p.approach)}</h3><p>${esc(p.approachText)}</p>`;
  if (p.approach && p.approach.length) h += `<h3>${esc(T.p.approach)}</h3><ul>` + p.approach.map((a) => `<li>${esc(a)}</li>`).join('') + '</ul>';
  if (p.result) h += `<h3>${esc(T.p.result)}</h3><p>${esc(p.result)}</p>`;
  if (p.team && p.team.length) h += `<h3>${esc(p.teamTitle)}</h3><ul>` + p.team.map((m) => `<li><strong>${esc(m.name)}</strong> : ${esc(m.did)}</li>`).join('') + '</ul>';
  const links = (p.links || []).map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('');
  if (links) h += `<div class="links">${links}</div>`;
  else if (p.private) h += `<p class="sub" style="margin-top:14px">${esc(p.privateLabel)}</p>`;
  return h;
}
function jobHtml(j) {
  let h = j.logoUrl ? `<img class="logo" src="/${esc(j.logoUrl)}" alt="">` : '';
  h += `<p class="kicker">${esc(j.dates)} · ${esc(j.place)}</p><h2 id="sheet-title">${esc(j.company)}</h2><p class="sub">${esc(j.role)}</p>`;
  if (j.about) h += `<h3>${esc(T.detail.company)}</h3><p>${esc(j.about)}</p>`;
  if (j.missions) h += `<h3>${esc(T.detail.missions)}</h3>` + j.missions.map((m) => `<p>${esc(m)}</p>`).join('');
  h += `<h3>${esc(T.projectsDone)}</h3>` + j.projects.map((p) => `<div class="proj"><strong>${esc(p.name)}</strong><p>${esc(p.text)}</p>${chipsHtml(p.stack.split(' · '))}</div>`).join('');
  return h;
}
function eduHtml(e) {
  let h = e.logoUrl ? `<img class="logo" src="/${esc(e.logoUrl)}" alt="">` : '';
  h += `<p class="kicker">${esc(e.dates)}</p><h2 id="sheet-title">${esc(e.name)}</h2><p class="sub">${esc(e.school)}</p>`;
  if (e.more) h += `<p>${esc(e.more)}</p>`;
  (e.groups || []).forEach((g) => { h += `<h3>${esc(g.title)}</h3>` + chipsHtml(g.items); });
  if (e.jobs) h += `<h3>${esc(T.eduJobs || 'Débouchés')}</h3><p>${esc(e.jobs)}</p>`;
  return h;
}

let sheetOpen = false;
function openSheet(html, spot) {
  $('sheet-body').innerHTML = html; $('sheet').hidden = false; sheetOpen = true;
  $('sheet').querySelector('.sheet-card').scrollTop = 0; $('sheet-close').focus();
  keys.clear(); stick.id = null; $('stick').hidden = true;
  if (spot && !spot.visited) { spot.visited = true; updateProgress(); }
}
function closeSheet() { $('sheet').hidden = true; sheetOpen = false; canvas.focus(); }
$('sheet-close').addEventListener('click', closeSheet);
$('sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') closeSheet(); });
function updateProgress() {
  const n = spots.filter((s) => s.visited).length, el = $('progress');
  el.textContent = n === spots.length ? 'Tout découvert, merci de ta visite' : `${n} / ${spots.length} découverts`;
  el.classList.toggle('done', n === spots.length);
}

// ---------------------------------------------------------------------------
// Remplir les salles avec le contenu du portfolio
// ---------------------------------------------------------------------------
const FAM = { front: '#DCE9FB', back: '#DDF0E3', data: '#E8E0F8', google: '#FBF1CC', method: '#F9E1E8', cloud: '#FBE5D4' };
async function exhibits() {
  const [photo, airbusLogo, andilLogo, ut1, ut3, aws] = await Promise.all(['/assets/diego.jpg', '/assets/airbus.png', '/assets/andil.png', '/assets/ut1-capitole.png', '/assets/ut3.png', '/assets/aws-cloud-foundations.png'].map(loadImg));
  const tl = new THREE.TextureLoader();

  // 01 · Accueil
  {
    const z = mid(R.accueil) - 1;
    const pt = tl.load('/assets/diego.jpg'); pt.colorSpace = THREE.SRGBColorSpace;
    const g = new THREE.Group(); g.position.set(-(W - 0.06), 2.3, z + 1.2); g.rotation.y = Math.PI / 2; scene.add(g);
    box(1.32, 1.4, 0.06, M.frame, 0, 0, -0.03, g);
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.27), new THREE.MeshStandardMaterial({ map: pt, roughness: 0.6 })); ph.position.z = 0.002; g.add(ph);
    wallPanel(-1, z - 1.6, { w: 2.6, h: 1.9, kicker: 'Portfolio · 2026', title: 'Diego Cortes', sub: T.hero.role, body: [T.hero.intro] });
    wallPanel(1, z, { w: 3.4, h: 2.3, kicker: T.about.title, title: 'Mon parcours', titleSize: 54, body: T.about.paras, bodySize: 27 });
    addSpot({ pos: new THREE.Vector3(-W + 1.4, 0, z - 0.2), label: 'Découvrir Diego', html: () => `<p class="kicker">${esc(T.about.title)}</p><h2 id="sheet-title">Diego Cortes</h2><p class="sub">${esc(T.hero.role)}</p><p>${esc(T.hero.intro)}</p>` + T.about.paras.map((p) => `<p>${esc(p)}</p>`).join('') });
    addSpot({ pos: new THREE.Vector3(W - 1.4, 0, z), label: 'Lire le parcours', html: () => `<p class="kicker">${esc(T.about.title)}</p><h2 id="sheet-title">Mon parcours</h2>` + T.about.paras.map((p) => `<p>${esc(p)}</p>`).join('') + `<h3>Ce que je recherche</h3><p>${esc(T.contact.lead)}</p>` });
    standPanel(0, z + 2.5, 0, { w: 1.1, h: 0.7, kicker: 'Bienvenue', title: 'Suivez le parcours', titleSize: 60, body: ['Six salles, de mon alternance chez Airbus jusqu\'au contact.'], bodySize: 34, accent: '#141414' });
    solid(-0.3, 0.3, z + 2.3, z + 2.7);
  }

  // 02 · Airbus : la maquette d'A320
  {
    const z = mid(R.airbus), job = T.jobs[0];
    plinth(0, z, 2.0, 0.8, 2.0, true);
    const plane = a320(); plane.name = 'a320'; plane.position.set(0, 2.15, z); scene.add(plane);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.2, 12), M.chrome); rod.position.set(0, 1.4, z); scene.add(rod);
    animated.push((t) => { plane.rotation.y = t * 0.18; plane.rotation.z = Math.sin(t * 0.6) * 0.03; });
    spotlight(0, H - 0.2, z + 3, 0, 2, z, 80, 0.5);
    standPanel(2.2, z + 2.2, -0.4, { w: 0.9, h: 0.55, kicker: 'Maquette · 1/20', title: 'Airbus A320', titleSize: 64, body: ['L\'avion le plus vendu d\'Airbus, conçu et assemblé à Toulouse.'], bodySize: 30, accent: R.airbus.accent });
    solid(1.95, 2.45, z + 2.0, z + 2.4);
    wallPanel(-1, z, { w: 4.2, h: 2.6, accent: R.airbus.accent, logo: airbusLogo, kicker: job.dates + ' · ' + job.place, title: job.role, titleSize: 50, body: [job.about, job.missions[0]], bodySize: 25 });
    addSpot({ pos: new THREE.Vector3(-W + 1.4, 0, z), label: 'Lire : Airbus Operations', html: () => jobHtml(job) });
    addSpot({ pos: new THREE.Vector3(0, 0, z + 2.8), r: 2.4, label: 'La maquette d\'A320', html: () => `<p class="kicker">Maquette · 1/20</p><h2 id="sheet-title">Airbus A320</h2><p>Deux ans d'alternance chez Airbus Operations, sur le site de Saint-Martin-du-Touch, au sein de l'équipe Digital Workplace.</p>` + job.missions.map((m) => `<p>${esc(m)}</p>`).join('') });
    job.projects.forEach((jp, i) => {
      const pz = z + 4.5 - i * 4.5;
      wallPanel(1, pz, { w: 3.0, h: 1.9, accent: R.airbus.accent, kicker: 'Réalisation · Airbus', title: jp.name, titleSize: 46, body: [jp.text], bodySize: 27, chips: jp.stack.split(' · ') });
      addSpot({ pos: new THREE.Vector3(W - 1.4, 0, pz), label: 'Lire : ' + jp.name, html: () => projectHtml(proj(jp.projectId), jp) });
    });
  }

  // 03 · Andil : le tableau de bord des plateformes Moodle
  {
    const z = mid(R.andil), job = T.jobs[1];
    plinth(0, z, 1.6, 0.9, 1.0);
    const c = document.createElement('canvas'); c.width = 1024; c.height = 600; const g = c.getContext('2d');
    g.fillStyle = '#f6f7f9'; g.fillRect(0, 0, 1024, 600);
    g.fillStyle = '#E2582A'; g.fillRect(0, 0, 1024, 64); g.fillStyle = '#fff'; g.font = `600 30px ${FONT}`; g.fillText('Plateformes Moodle · tableau de bord', 28, 42);
    const r = rnd(8);
    for (let i = 0; i < 3; i++) { g.fillStyle = '#fff'; roundRect(g, 28 + i * 330, 90, 300, 120, 12); g.fill(); g.fillStyle = '#6B6B66'; g.font = `400 22px ${FONT}`; g.fillText(['Plateformes', 'Utilisateurs actifs', 'Disponibilité'][i], 52 + i * 330, 130); g.fillStyle = '#141414'; g.font = `600 46px ${FONT}`; g.fillText(['42', '18 230', '99,9 %'][i], 52 + i * 330, 188); }
    g.fillStyle = '#fff'; roundRect(g, 28, 232, 620, 340, 12); g.fill();
    for (let i = 0; i < 12; i++) { const hh = 60 + r() * 220; g.fillStyle = i % 2 ? '#F4B49A' : '#E2582A'; g.fillRect(60 + i * 48, 540 - hh, 30, hh); }
    g.fillStyle = '#fff'; roundRect(g, 668, 232, 328, 340, 12); g.fill();
    for (let i = 0; i < 7; i++) { g.fillStyle = '#EDEEF0'; g.fillRect(690, 262 + i * 44, 284, 30); g.fillStyle = i < 6 ? '#1F7A45' : '#B42318'; g.beginPath(); g.arc(710, 277 + i * 44, 7, 0, 7); g.fill(); }
    const dash = new THREE.CanvasTexture(c); dash.colorSpace = THREE.SRGBColorSpace;
    const mon = screen(1.4, 0.82, dash, 0, 1.55, z, 0); box(0.08, 0.36, 0.08, M.dark, 0, -0.55, -0.05, mon); box(0.42, 0.03, 0.26, M.dark, 0, -0.73, 0, mon);
    animated.push((t) => { mon.rotation.y = Math.sin(t * 0.35) * 0.35; });
    spotlight(0, H - 0.2, z + 2, 0, 1.3, z, 45, 0.45);
    const lt = new THREE.CanvasTexture((() => { const cc = document.createElement('canvas'); cc.width = 512; cc.height = 256; const gg = cc.getContext('2d'); gg.fillStyle = '#fff'; gg.fillRect(0, 0, 512, 256); if (andilLogo) gg.drawImage(andilLogo, 256 - 75, 20, 150, 175); gg.fillStyle = '#6B6B66'; gg.font = `400 26px ${MONO}`; gg.textAlign = 'center'; gg.fillText('ANDIL · LABÈGE', 256, 232); return cc; })());
    lt.colorSpace = THREE.SRGBColorSpace;
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), new THREE.MeshStandardMaterial({ map: lt, roughness: 0.6 })); plaque.position.set(0, 0.5, z + 0.505); scene.add(plaque);
    wallPanel(-1, z, { w: 4.0, h: 2.5, accent: R.andil.accent, logo: andilLogo, kicker: job.dates + ' · ' + job.place, title: job.role, titleSize: 50, body: [job.about, job.missions[0]], bodySize: 26 });
    addSpot({ pos: new THREE.Vector3(-W + 1.4, 0, z), label: 'Lire : Andil', html: () => jobHtml(job) });
    addSpot({ pos: new THREE.Vector3(0, 0, z + 1.6), r: 2.2, label: 'Le tableau de bord', html: () => projectHtml(null, job.projects[1]) });
    job.projects.forEach((jp, i) => {
      const pz = z + 2.5 - i * 5;
      wallPanel(1, pz, { w: 3.0, h: 1.8, accent: R.andil.accent, kicker: 'Réalisation · Andil', title: jp.name, titleSize: 48, body: [jp.text], bodySize: 28, chips: jp.stack.split(' · ') });
      addSpot({ pos: new THREE.Vector3(W - 1.4, 0, pz), label: 'Lire : ' + jp.name, html: () => projectHtml(null, jp) });
    });
  }

  // 04 · Formation : trois diplômes sur un podium, et la certification AWS
  {
    const z = mid(R.formation), eds = T.education.slice().reverse(); // de la licence au master
    const logos = { 'assets/ut3.png': ut3, 'assets/ut1-capitole.png': ut1 };
    eds.forEach((e, i) => {
      const x = (i - 1) * 3.2, h = 0.75 + i * 0.22;
      plinth(x, z, 1.0, h, 1.0);
      const cap = mortarboard([0x2b3a55, 0x1d3b2f, 0x141414][i]); cap.scale.setScalar(1.7); cap.position.set(x, h, z); scene.add(cap);
      animated.push((t) => { cap.rotation.y = t * 0.3 + i; cap.position.y = h + 0.04 + Math.sin(t * 1.2 + i) * 0.02; });
      const tex = panelTexture({ w: 0.96, h: 0.6, accent: R.formation.accent, logo: logos[e.logoUrl], kicker: e.dates, title: e.name, titleSize: 44, bg: '#FFFFFF' });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.96, Math.min(0.6, h - 0.1)), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }));
      pl.position.set(x, h / 2, z + 0.505); scene.add(pl);
      spotlight(x, H - 0.2, z + 1.5, x, h, z, 30, 0.32);
      addSpot({ pos: new THREE.Vector3(x, 0, z + 1.4), r: 1.6, label: 'Lire : ' + e.name, html: () => eduHtml(e) });
    });
    wallPanel(-1, z, { w: 4.0, h: 2.4, accent: R.formation.accent, kicker: 'Salle 04', title: 'Mes études', titleSize: 60,
      bullets: T.education.map((e) => e.dates + ' · ' + e.name), body: ['Une licence d\'informatique, puis trois ans d\'alternance : licence professionnelle chez Andil, Master MIAGE chez Airbus.'], bodySize: 28 });
    addSpot({ pos: new THREE.Vector3(-W + 1.4, 0, z), label: 'Lire : mes études', html: () => '<p class="kicker">Formation</p><h2 id="sheet-title">Mes études</h2>' + T.education.map((e) => `<div class="proj"><strong>${esc(e.name)}</strong><p>${esc(e.dates)} · ${esc(e.school)}</p></div>`).join('') });
    const cert = T.certs[0];
    wallPanel(1, z, { w: 2.6, h: 2.2, accent: '#232F3E', logo: aws, kicker: 'Certification', title: cert.name, titleSize: 46, body: [cert.issuer], bodySize: 28 });
    addSpot({ pos: new THREE.Vector3(W - 1.4, 0, z), label: 'Voir la certification AWS', html: () => `<img class="logo" style="max-height:90px" src="/${esc(cert.img)}" alt=""><p class="kicker">${esc(T.certsTitle)}</p><h2 id="sheet-title">${esc(cert.name)}</h2><p class="sub">${esc(cert.issuer)}</p><div class="links"><a class="primary" href="${esc(cert.url)}" target="_blank" rel="noopener">${esc(cert.link)} ↗</a></div>` });
  }

  // 05 · Projets : RunMates en grand, les autres en affiches
  {
    const z = mid(R.projets), rm = proj('runmates');
    const video = document.createElement('video');
    video.src = '/' + rm.video.split('?')[0]; video.muted = true; video.loop = true; video.playsInline = true; video.crossOrigin = 'anonymous'; video.preload = 'auto';
    const vt = new THREE.VideoTexture(video); vt.colorSpace = THREE.SRGBColorSpace;
    screens.video = video;
    screen(5.2, 2.925, vt, -(W - 0.1), 2.45, z + 3.5, Math.PI / 2);
    wallPanel(-1, z - 2.4, { w: 2.6, h: 2.1, accent: R.projets.accent, kicker: rm.year + ' · ' + rm.kind, title: rm.name, titleSize: 70, body: [rm.pitch], bodySize: 30, chips: rm.stack.split(' · ') }, 2.2);
    addSpot({ pos: new THREE.Vector3(-W + 1.5, 0, z + 1), r: 3, label: 'Lire : RunMates', html: () => projectHtml(rm) });
    // téléphone sur socle, avec l'écran « Sorties »
    plinth(0, z + 1, 1.0, 0.9, 1.0);
    const st = tl.load('/' + rm.img); st.colorSpace = THREE.SRGBColorSpace;
    const phone = new THREE.Group(); phone.position.set(0, 1.42, z + 1); scene.add(phone);
    const body = box(0.25, 0.52, 0.024, M.dark, 0, 0, 0, phone); body.castShadow = true;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.232, 0.5), new THREE.MeshBasicMaterial({ map: st, toneMapped: false })); scr.position.z = 0.0125; phone.add(scr);
    animated.push((t) => { phone.rotation.y = Math.sin(t * 0.5) * 0.6; });
    spotlight(0, H - 0.2, z + 2.6, 0, 1.4, z + 1, 40, 0.35);
    // Les autres projets, en affiches sur le mur d'en face
    const others = PROJECTS.filter((p) => !p.featured && !p.inExperience);
    const span = 17, step = span / others.length;
    others.forEach((p, i) => {
      const pz = z + span / 2 - step / 2 - i * step, high = i % 2 === 0;
      wallPanel(1, pz, { w: Math.min(2.25, step - 0.25), h: 1.55, accent: R.projets.accent, kicker: p.year + ' · ' + p.kind, title: p.name, titleSize: 44, body: [p.pitch], bodySize: 27, chips: p.stack.split(' · ').slice(0, 4) }, high ? 2.6 : 2.0);
      addSpot({ pos: new THREE.Vector3(W - 1.4, 0, pz), r: Math.min(2.2, step / 2 + 0.3), label: 'Lire : ' + p.name, html: () => projectHtml(p) });
    });
    // En ce moment
    standPanel(-3.6, z - 6.5, 0.6, { w: 1.2, h: 0.85, accent: R.projets.accent, kicker: T.now.title, title: T.now.items.map((i) => i.name).join(' · '), titleSize: 50, body: T.now.items.map((i) => i.text), bodySize: 26 });
    solid(-3.9, -3.3, z - 6.8, z - 6.2);
    addSpot({ pos: new THREE.Vector3(-3.6, 0, z - 5.4), r: 1.6, label: 'En ce moment', html: () => `<p class="kicker">${esc(T.now.when)}</p><h2 id="sheet-title">${esc(T.now.title)}</h2>` + T.now.items.map((i) => `<div class="proj"><strong>${esc(i.name)}</strong><p>${esc(i.text)}</p></div>`).join('') });
  }

  // 06 · Compétences : des colonnes de cubes, une par famille
  {
    const z = mid(R.competences);
    const fams = T.skills.filter((s) => s.fam), n = fams.length, S = 0.46;
    fams.forEach((s, i) => {
      const a = (i / (n - 1) - 0.5) * 2.1, x = Math.sin(a) * 3.6, cz = z + 1.5 - Math.cos(a) * 3.6;
      const col = new THREE.Group(); col.position.set(x, 0, cz); col.rotation.y = -a; scene.add(col);
      s.items.forEach((it, k) => {
        const tex = cubeLabel(it, FAM[s.fam] || '#EFEFEA'), mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 });
        const cube = new THREE.Mesh(new THREE.BoxGeometry(S, S, S), mat); cube.position.y = S / 2 + k * (S + 0.015); cube.rotation.y = (k % 2 ? 0.08 : -0.06);
        cube.castShadow = cube.receiveShadow = true; col.add(cube);
      });
      const top = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), new THREE.MeshBasicMaterial({ map: panelTexture({ w: 1.2, h: 0.3, title: s.title, titleSize: 64, accent: '#55349A', bg: '#ffffff' }), toneMapped: false }));
      top.position.y = s.items.length * (S + 0.015) + 0.35; col.add(top);
      solid(x - 0.35, x + 0.35, cz - 0.35, cz + 0.35);
    });
    spotlight(0, H - 0.2, z + 3, 0, 1.2, z - 1, 70, 0.75);
    const soft = T.skills.filter((s) => !s.fam && s.plain);
    wallPanel(1, z, { w: 3.4, h: 2.2, accent: R.competences.accent, kicker: 'Au-delà du code', title: 'Soft skills et loisirs', titleSize: 52, bullets: soft.map((s) => s.title + ' : ' + s.items.join(', ')), bodySize: 30 });
    addSpot({ pos: new THREE.Vector3(W - 1.4, 0, z), label: 'Lire : soft skills et loisirs', html: () => '<p class="kicker">Au-delà du code</p><h2 id="sheet-title">Soft skills et loisirs</h2>' + soft.map((s) => `<h3>${esc(s.title)}</h3>${chipsHtml(s.items)}`).join('') });
    addSpot({ pos: new THREE.Vector3(0, 0, z + 2.4), r: 2.6, label: 'Lire : toutes mes compétences', html: () => '<p class="kicker">Salle 06</p><h2 id="sheet-title">Compétences</h2>' + T.skills.filter((s) => !s.plain).map((s) => `<h3>${esc(s.title)}</h3>${chipsHtml(s.items)}`).join('') });
  }

  // 07 · Contact : un bureau, un ordinateur qui ouvre le portfolio
  {
    const z = mid(R.contact) - 1.5;
    const end = new THREE.Group(); end.position.set(0, 2.5, Z_END + 0.02); scene.add(end);
    const et = panelTexture({ w: 6, h: 2.6, accent: '#141414', kicker: 'Salle 07 · Contact', title: 'Travaillons ensemble', titleSize: 96, body: [T.contact.lead, ME.email + '  ·  ' + ME.phoneLabel], bodySize: 40 });
    const ep = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.6), new THREE.MeshBasicMaterial({ map: et, color: 0xf2f2f2 })); end.add(ep);
    // bureau
    const wood = new THREE.MeshStandardMaterial({ color: 0xb08a62, roughness: 0.55 });
    box(1.8, 0.05, 0.85, wood, 0, 0.76, z); for (const x of [-0.82, 0.82]) box(0.05, 0.74, 0.75, M.dark, x, 0.37, z);
    solid(-0.95, 0.95, z - 0.5, z + 0.5);
    const site = tl.load('/balade/assets/site.jpg'); site.colorSpace = THREE.SRGBColorSpace;
    const alu = new THREE.MeshStandardMaterial({ color: 0xbfc2c7, metalness: 0.85, roughness: 0.32 });
    const lap = new THREE.Group(); lap.position.set(0, 0.785, z + 0.08); scene.add(lap);
    box(0.34, 0.014, 0.235, alu, 0, 0.007, 0, lap);
    const hinge = new THREE.Group(); hinge.position.set(0, 0.014, -0.1175); hinge.rotation.x = -0.21; lap.add(hinge);
    box(0.34, 0.225, 0.006, alu, 0, 0.1125, -0.003, hinge);
    const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.3136, 0.196), new THREE.MeshBasicMaterial({ map: site, toneMapped: false })); lcd.position.set(0, 0.1155, 0.0004); hinge.add(lcd);
    screens.laptop = lcd;
    spotlight(0, H - 0.2, z + 1.5, 0, 0.8, z, 35, 0.5);
    addSpot({ pos: new THREE.Vector3(0, 0, z + 1.2), r: 2.2, label: 'Me contacter', contact: true, html: () => `<p class="kicker">Contact</p><h2 id="sheet-title">Travaillons ensemble</h2><p>${esc(T.contact.lead)}</p>
      <div class="links"><a class="primary" href="mailto:${ME.email}">${ME.email}</a><a href="tel:${ME.phone}">${ME.phoneLabel}</a><a href="${ME.cv}" download>${esc(T.contact.cv)}</a><a href="${ME.github}" target="_blank" rel="noopener">GitHub ↗</a></div>
      <div class="links"><a href="#" id="go-site">Ouvrir le portfolio sur l'ordinateur →</a></div>` });
  }
}
const screens = {};

// ---------------------------------------------------------------------------
// Le personnage (avatar et animations de la balade)
// ---------------------------------------------------------------------------
const player = { pos: new THREE.Vector3(0, 0, 3.5), yaw: Math.PI, speed: 0 };
let model, mixer; const actions = {}, weights = { Idle: 1, Walk: 0, Run: 0 };
function makePlayer(gltf, clips) {
  model = gltf.scene;
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    if (/Outfit_Top/.test(o.name)) o.material.color.setRGB(0.36, 0.43, 0.6);
    if (/Outfit_Bottom/.test(o.name)) o.material.color.setRGB(0.3, 0.33, 0.4);
  });
  mixer = new THREE.AnimationMixer(model);
  clips.forEach((j) => { const c = THREE.AnimationClip.parse(j); actions[c.name] = mixer.clipAction(c); actions[c.name].play(); actions[c.name].setEffectiveWeight(c.name === 'Idle' ? 1 : 0); });
  scene.add(model);
}
function animate(dt) {
  const s = player.speed, target = s < 0.15 ? { Idle: 1, Walk: 0, Run: 0 } : s < 2.6 ? { Idle: 0, Walk: 1, Run: 0 } : { Idle: 0, Walk: 0, Run: 1 };
  for (const k in weights) { weights[k] = lerp(weights[k], target[k], Math.min(1, dt * 6)); if (actions[k]) actions[k].setEffectiveWeight(weights[k]); }
  if (actions.Walk) actions.Walk.setEffectiveTimeScale(clamp(s / 1.6, 0.6, 1.4));
  if (actions.Run) actions.Run.setEffectiveTimeScale(clamp(s / 4.2, 0.7, 1.2));
  mixer.update(dt);
}

// ---------------------------------------------------------------------------
// Commandes
// ---------------------------------------------------------------------------
const keys = new Set();
addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && sheetOpen) { closeSheet(); return; }
  if (sheetOpen) return;
  keys.add(e.code);
  if (e.code === 'KeyE' && near && state === 'walk') readSpot();
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
const cam = { yaw: 0, pitch: 0.2, dist: 3.8 };
let drag = null;
const stick = { id: null, x: 0, y: 0, dx: 0, dy: 0 };
canvas.addEventListener('pointerdown', (e) => {
  if (state !== 'walk') return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth * 0.45 && stick.id === null) {
    stick.id = e.pointerId; stick.x = e.clientX; stick.y = e.clientY; stick.dx = stick.dy = 0;
    const el = $('stick'); el.hidden = false; el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px'; el.firstChild.style.transform = '';
  } else if (!drag) { drag = { id: e.pointerId, x: e.clientX, y: e.clientY }; canvas.classList.add('grabbing'); }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) {
    let dx = e.clientX - stick.x, dy = e.clientY - stick.y; const l = Math.hypot(dx, dy), m = 50;
    if (l > m) { dx *= m / l; dy *= m / l; }
    stick.dx = dx / m; stick.dy = dy / m; $('stick').firstChild.style.transform = `translate(${dx}px,${dy}px)`;
  } else if (drag && e.pointerId === drag.id) {
    cam.yaw -= (e.clientX - drag.x) * 0.005; cam.pitch = clamp(cam.pitch + (e.clientY - drag.y) * 0.003, -0.1, 0.75);
    drag.x = e.clientX; drag.y = e.clientY;
  }
});
function release(e) {
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; $('stick').hidden = true; }
  if (drag && e.pointerId === drag.id) { drag = null; canvas.classList.remove('grabbing'); }
}
canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
canvas.addEventListener('wheel', (e) => { cam.dist = clamp(cam.dist + e.deltaY * 0.003, 2.2, 6); }, { passive: true });

// ---------------------------------------------------------------------------
// Déplacement, collisions, caméra
// ---------------------------------------------------------------------------
function collide(p, r = 0.32) {
  for (const b of solids) {
    const cx = clamp(p.x, b.x0, b.x1), cz = clamp(p.z, b.z0, b.z1), dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
    if (d < r) {
      if (d > 1e-5) { p.x = cx + dx / d * r; p.z = cz + dz / d * r; }
      else { // à l'intérieur : sortir par le côté le plus proche
        const o = [p.x - b.x0, b.x1 - p.x, p.z - b.z0, b.z1 - p.z], k = o.indexOf(Math.min(...o));
        if (k === 0) p.x = b.x0 - r; else if (k === 1) p.x = b.x1 + r; else if (k === 2) p.z = b.z0 - r; else p.z = b.z1 + r;
      }
    }
  }
}
function move(dt) {
  let fx = 0, sx = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) fx += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) fx -= 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) sx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) sx += 1;
  if (stick.id !== null) { fx = -stick.dy; sx = stick.dx; }
  const amt = Math.min(1, Math.hypot(fx, sx));
  const run = keys.has('ShiftLeft') || keys.has('ShiftRight') || (stick.id !== null && amt > 0.92);
  const want = amt > 0.05 ? (run ? 4.2 : 1.7) * (stick.id !== null ? Math.max(amt, 0.5) : 1) : 0;
  player.speed = lerp(player.speed, want, Math.min(1, dt * (want > player.speed ? 5 : 8)));
  if (amt > 0.05) {
    const dx = -Math.sin(cam.yaw) * fx + Math.cos(cam.yaw) * sx, dz = -Math.cos(cam.yaw) * fx - Math.sin(cam.yaw) * sx;
    let d = Math.atan2(dx, dz) - player.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    player.yaw += d * Math.min(1, dt * 10);
  }
  player.pos.x += Math.sin(player.yaw) * player.speed * dt;
  player.pos.z += Math.cos(player.yaw) * player.speed * dt;
  collide(player.pos);
  player.pos.x = clamp(player.pos.x, -W + 0.35, W - 0.35); player.pos.z = clamp(player.pos.z, Z_END + 0.4, Z_START - 0.4);
  if (!drag && player.speed > 0.3 && fx > 0 && Math.abs(sx) < 0.1) { let d = (player.yaw + Math.PI) - cam.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); cam.yaw += d * Math.min(1, dt * 0.9); }
}
const camTarget = new THREE.Vector3(), want = new THREE.Vector3(), ray = new THREE.Raycaster(), dir = new THREE.Vector3();
function followCamera(dt, snap) {
  camTarget.set(player.pos.x, 1.5, player.pos.z);
  const hz = Math.cos(cam.pitch) * cam.dist;
  want.set(camTarget.x + Math.sin(cam.yaw) * hz, camTarget.y + Math.sin(cam.pitch) * cam.dist + 0.15, camTarget.z + Math.cos(cam.yaw) * hz);
  // ne pas traverser les murs
  dir.subVectors(want, camTarget); const len = dir.length(); dir.normalize();
  ray.set(camTarget, dir); ray.far = len;
  const hit = ray.intersectObjects(occluders, false)[0];
  if (hit) want.copy(camTarget).addScaledVector(dir, Math.max(0.6, hit.distance - 0.25));
  want.y = clamp(want.y, 0.5, H - 0.3);
  if (snap) camera.position.copy(want); else camera.position.lerp(want, Math.min(1, dt * 9));
  camera.lookAt(camTarget);
}

// ---------------------------------------------------------------------------
// Lire, salles, sortie vers le portfolio
// ---------------------------------------------------------------------------
let state = 'loading', near = null, room = null, tween = null;
function readSpot() { if (!near) return; openSheet(near.html(), near); const go = $('go-site'); if (go) go.addEventListener('click', (e) => { e.preventDefault(); closeSheet(); openSite(); }); }
$('read').addEventListener('click', readSpot);
function openSite() {
  if (!screens.laptop) { location.href = '/'; return; }
  state = 'opening'; $('read').hidden = true; if (model) model.visible = false;
  const lcd = screens.laptop, c = lcd.getWorldPosition(new THREE.Vector3()), n = new THREE.Vector3(0, 0, 1).applyQuaternion(lcd.getWorldQuaternion(new THREE.Quaternion()));
  const halfV = THREE.MathUtils.degToRad(camera.fov / 2), dist = Math.min(0.098 / Math.tan(halfV), 0.1568 / (Math.tan(halfV) * camera.aspect)) * 0.98;
  const m = new THREE.Matrix4().lookAt(c.clone().addScaledVector(n, dist), c, new THREE.Vector3(0, 1, 0));
  tween = { p0: camera.position.clone(), q0: camera.quaternion.clone(), p1: c.clone().addScaledVector(n, dist), q1: new THREE.Quaternion().setFromRotationMatrix(m), t: 0, dur: 1.8,
    done: () => { $('fade').classList.add('on'); setTimeout(() => { location.href = '/'; }, 420); } };
}
addEventListener('pageshow', (e) => { if (e.persisted) { $('fade').classList.remove('on'); if (state === 'opening') { state = 'walk'; if (model) model.visible = true; } } });
let roomTimer = 0;
function showRoom(r) {
  const el = $('room'); el.textContent = 'Salle ' + r.n + ' · ' + r.title; el.hidden = false; el.classList.remove('gone');
  clearTimeout(roomTimer); roomTimer = setTimeout(() => el.classList.add('gone'), 2600);
}

// ---------------------------------------------------------------------------
// Boucle
// ---------------------------------------------------------------------------
const clock = new THREE.Clock(), MANUAL = location.search.includes('manual');
let simT = 0;
function frame(fixed) {
  let dt, t;
  if (MANUAL) { dt = typeof fixed === 'number' ? fixed : 0; simT += dt; t = simT; } else { dt = Math.min(clock.getDelta(), 0.05); t = clock.elapsedTime; }
  if (state === 'walk' && !sheetOpen) move(dt);
  if (state === 'walk' || state === 'ready') followCamera(dt, false);
  if (model) { model.position.copy(player.pos); model.rotation.y = player.yaw; animate(dt); }
  if (tween) {
    tween.t += dt / tween.dur; const k = ease(Math.min(1, tween.t));
    camera.position.lerpVectors(tween.p0, tween.p1, k); camera.quaternion.slerpQuaternions(tween.q0, tween.q1, k);
    if (tween.t >= 1) { const d = tween.done; tween = null; d && d(); }
  }
  if (state === 'walk') {
    let best = null, bd = 1e9;
    for (const s of spots) { const d = Math.hypot(player.pos.x - s.pos.x, player.pos.z - s.pos.z); if (d < s.r && d < bd) { bd = d; best = s; } }
    if (best !== near) { near = best; $('read').hidden = !near || sheetOpen; if (near) $('read-label').textContent = near.label; }
    else if (near) $('read').hidden = sheetOpen;
    const r = ROOMS.find((x) => player.pos.z <= x.z0 && player.pos.z > x.z1);
    if (r && r !== room) { if (room) showRoom(r); room = r; }
  }
  animated.forEach((f) => f(t, dt));
  key.target.position.set(player.pos.x * 0.3, 0, player.pos.z - 2); key.position.set(key.target.position.x + 3, 14, key.target.position.z + 6);
  if (!MANUAL || fixed === 'draw') renderer.render(scene, camera);
  if (!MANUAL) requestAnimationFrame(() => frame());
}
addEventListener('resize', () => { camera.fov = innerWidth < innerHeight ? 70 : 58; camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

// ---------------------------------------------------------------------------
// Chargement
// ---------------------------------------------------------------------------
function progress(p, label) { $('bar').style.width = Math.round(p * 100) + '%'; $('loading-text').textContent = (label || 'Montage de l\'exposition… ') + Math.round(p * 100) + ' %'; }
async function init() {
  progress(0.05);
  try { await Promise.all(['400 30px Geist', '500 30px Geist', '400 30px "Geist Mono"'].map((f) => document.fonts.load(f))); } catch (e) { /* police de secours */ }
  const gl = new GLTFLoader();
  const avatarP = gl.loadAsync('/balade/assets/avatar.glb'), clipsP = fetch('/balade/assets/avatar-anims.json').then((r) => r.json());
  building(); progress(0.25);
  await exhibits(); progress(0.6);
  makePlayer(await avatarP, await clipsP); progress(0.9);
  updateProgress();
  cam.yaw = 0; scene.updateMatrixWorld(true); followCamera(0, true);
  renderer.compile(scene, camera);
  state = 'ready'; frame(); progress(1);
  $('loading').hidden = true; $('ready').hidden = false; $('start').focus();
}
$('start').addEventListener('click', () => {
  $('intro').classList.add('gone'); setTimeout(() => { $('intro').hidden = true; }, 650);
  state = 'walk'; canvas.classList.add('grab'); $('progress').hidden = false;
  showRoom(R.accueil); room = R.accueil;
  if (screens.video) screens.video.play().catch(() => {});
  canvas.focus();
});
if (location.search.includes('debug')) window.__m = { scene, THREE, player, cam, renderer, spots, readSpot, openSite, keys, get state() { return state; }, step(n) { for (let i = 0; i < n; i++) frame(1 / 30); frame('draw'); } };
init().catch((e) => { console.error(e); $('loading').hidden = true; $('error').hidden = false; });
