// Balade : une allée d'arbres, une table, un ordinateur qui ouvre le portfolio.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Sky } from 'three/addons/Sky.js';
import { Tree, TreePreset } from '/balade/js/ez-tree/index.js';

const A = '/balade/assets/';
const $ = (id) => document.getElementById(id);
const TOUCH = matchMedia('(pointer: coarse)').matches;
const lerp = THREE.MathUtils.lerp;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---------------------------------------------------------------------------
// Le chemin : une allée qui serpente légèrement, et une clairière au bout
// ---------------------------------------------------------------------------
const pathX = (z) => 1.2 * Math.sin(z * 0.045) + 0.6 * Math.sin(z * 0.11 + 1.3);
const START_Z = 7, END_Z = -60;
const TABLE = new THREE.Vector3(pathX(END_Z - 3), 0, END_Z - 3);
const CLEARING_R = 5.5;
function onPath(x, z, margin = 0) {
  if (z < START_Z + 6 && z > END_Z - 3 && Math.abs(x - pathX(z)) < 1.6 + margin) return true;
  return Math.hypot(x - TABLE.x, z - TABLE.z) < CLEARING_R + margin;
}

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------
const canvas = $('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  $('loading').hidden = true; $('error').hidden = false;
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, TOUCH ? 1.25 : 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const FOG = new THREE.Color(0xb9c8bf);
scene.fog = new THREE.FogExp2(FOG, 0.016);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 1500);

// Ciel et soleil de fin d'après-midi
const sky = new Sky();
sky.scale.setScalar(1200);
const su = sky.material.uniforms;
su.turbidity.value = 3; su.rayleigh.value = 2.2; su.mieCoefficient.value = 0.006; su.mieDirectionalG.value = 0.85;
const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(58), THREE.MathUtils.degToRad(215));
su.sunPosition.value.copy(sunDir);
scene.add(sky);

const sun = new THREE.DirectionalLight(0xfff0d6, 2.6);
sun.castShadow = true;
sun.shadow.mapSize.set(TOUCH ? 1024 : 2048, TOUCH ? 1024 : 2048);
const sc = sun.shadow.camera; sc.left = -28; sc.right = 28; sc.top = 28; sc.bottom = -28; sc.near = 1; sc.far = 160;
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x4a5a2a, 0.4));

// ---------------------------------------------------------------------------
// Textures dessinées au chargement (écorce, feuilles)
// ---------------------------------------------------------------------------
function rnd(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function barkTextures() {
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'), r = rnd(7);
  g.fillStyle = '#7d6e5e'; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 2600; i++) { // fibres verticales
    const x = r() * N, w = 1 + r() * 5, l = 30 + r() * 140, y = r() * N, v = 70 + r() * 80;
    g.fillStyle = `rgba(${v + 20},${v + 10},${v},${0.15 + r() * 0.35})`;
    g.fillRect(x, y, w, l); g.fillRect(x, y - N, w, l); g.fillRect(x - N, y, w, l);
  }
  for (let i = 0; i < 340; i++) { // crevasses sombres
    const x = r() * N, y = r() * N, l = 20 + r() * 90;
    g.strokeStyle = `rgba(20,16,12,${0.35 + r() * 0.4})`; g.lineWidth = 1 + r() * 3;
    g.beginPath(); g.moveTo(x, y);
    g.bezierCurveTo(x + (r() - 0.5) * 12, y + l * 0.3, x + (r() - 0.5) * 12, y + l * 0.6, x + (r() - 0.5) * 8, y + l); g.stroke();
  }
  for (let i = 0; i < 60; i++) { // lichen
    const x = r() * N, y = r() * N, s = 4 + r() * 16;
    g.fillStyle = `rgba(${110 + r() * 40},${125 + r() * 40},${90},${0.12 + r() * 0.15})`;
    g.beginPath(); g.ellipse(x, y, s, s * 0.7, 0, 0, Math.PI * 2); g.fill();
  }
  // Carte de normales tirée du relief (luminosité = hauteur)
  const src = g.getImageData(0, 0, N, N).data, nc = document.createElement('canvas'); nc.width = nc.height = N;
  const ng = nc.getContext('2d'), out = ng.createImageData(N, N), h = (x, y) => src[(((y + N) % N) * N + ((x + N) % N)) * 4] / 255;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = (h(x + 1, y) - h(x - 1, y)) * 3, dy = (h(x, y + 1) - h(x, y - 1)) * 3, k = (y * N + x) * 4;
    const l = Math.hypot(dx, dy, 1);
    out.data[k] = (-dx / l * 0.5 + 0.5) * 255; out.data[k + 1] = (dy / l * 0.5 + 0.5) * 255; out.data[k + 2] = (1 / l * 0.5 + 0.5) * 255; out.data[k + 3] = 255;
  }
  ng.putImageData(out, 0, 0);
  const color = new THREE.CanvasTexture(c); color.colorSpace = THREE.SRGBColorSpace;
  const normal = new THREE.CanvasTexture(nc);
  [color, normal].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; });
  return { color, normal };
}

// Un rameau de feuilles sur fond transparent
function leafTexture(kind, seed) {
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'), r = rnd(seed);
  const leaves = kind === 'aspen' ? 9 : 11;
  g.strokeStyle = '#4b5a2a'; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath(); g.moveTo(N / 2, N - 4); g.quadraticCurveTo(N / 2 + 8, N / 2, N / 2 - 4, 18); g.stroke();
  for (let i = 0; i < leaves; i++) {
    const t = 0.12 + (i / leaves) * 0.85, side = i % 2 ? 1 : -1;
    const bx = N / 2 + (side * 4) * (1 - t), by = N - 4 - t * (N - 26);
    const ang = -Math.PI / 2 + side * (0.75 + r() * 0.5) * (1 - t * 0.5);
    const len = (kind === 'aspen' ? 58 : 70) * (0.75 + r() * 0.4) * (1 - t * 0.25), wid = len * (kind === 'aspen' ? 0.62 : 0.42);
    const hue = 78 + r() * 26, sat = 38 + r() * 22, lig = 26 + r() * 16;
    g.save(); g.translate(bx, by); g.rotate(ang);
    const grd = g.createLinearGradient(0, -wid, 0, wid);
    grd.addColorStop(0, `hsl(${hue},${sat}%,${lig + 9}%)`); grd.addColorStop(1, `hsl(${hue},${sat}%,${lig - 4}%)`);
    g.fillStyle = grd; g.beginPath(); g.moveTo(0, 0);
    if (kind === 'oak') { // feuille lobée
      for (let k = 0; k <= 6; k++) { const x = (k / 6) * len, y = -wid * Math.sin((k / 6) * Math.PI) * (k % 2 ? 1.1 : 0.7); g.quadraticCurveTo(x - len / 12, y * 1.25, x, y); }
      for (let k = 6; k >= 0; k--) { const x = (k / 6) * len, y = wid * Math.sin((k / 6) * Math.PI) * (k % 2 ? 1.1 : 0.7); g.quadraticCurveTo(x + len / 12, y * 1.25, x, y); }
    } else {
      g.quadraticCurveTo(len * 0.35, -wid, len, 0); g.quadraticCurveTo(len * 0.35, wid, 0, 0);
    }
    g.fill();
    g.strokeStyle = `hsla(${hue},30%,${lig + 22}%,.55)`; g.lineWidth = 1.2; // nervure
    g.beginPath(); g.moveTo(2, 0); g.lineTo(len * 0.92, 0); g.stroke();
    g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.premultiplyAlpha = true; t.anisotropy = 4;
  return t;
}

// ---------------------------------------------------------------------------
// Sol : herbe, et terre battue le long du chemin
// ---------------------------------------------------------------------------
function makeGround(grassTex) {
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping; grassTex.colorSpace = THREE.SRGBColorSpace; grassTex.anisotropy = 8;
  const mat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, metalness: 0 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTable = { value: new THREE.Vector3(TABLE.x, CLEARING_R, TABLE.z) };
    sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = `varying vec3 vWP; uniform vec3 uTable;
      float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
      float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<4;i++){ s+=a*vn(p); p*=2.03; a*=0.5; } return s; }
      float pathX(float z){ return 1.2*sin(z*0.045) + 0.6*sin(z*0.11+1.3); }
    ` + sh.fragmentShader.replace('#include <map_fragment>', `
      vec2 wp = vWP.xz;
      vec3 g1 = texture2D(map, wp / 3.2).rgb, g2 = texture2D(map, wp / 13.0 + 0.37).rgb;
      float big = fbm(wp * 0.06);
      vec3 grass = mix(g1, g2, 0.45) * (0.72 + 0.45 * big) * vec3(0.72, 0.8, 0.6);
      grass = mix(grass, grass * vec3(1.15, 1.0, 0.7), smoothstep(0.55, 0.8, fbm(wp * 0.11 + 7.0)));
      float n = fbm(wp * 0.9);
      vec3 dirt = mix(vec3(0.3, 0.2, 0.11), vec3(0.45, 0.32, 0.19), n);
      dirt *= 0.85 + 0.3 * vn(wp * 9.0);
      dirt = mix(dirt, vec3(0.46, 0.42, 0.36), step(0.94, h21(floor(wp * 22.0))) * 0.5); // gravillons
      float edge = 1.55 + 0.5 * (fbm(wp * 1.4) - 0.5);
      float d = abs(wp.x - pathX(wp.y));
      float onPath = (1.0 - smoothstep(edge - 0.35, edge + 0.25, d)) * step(${(END_Z - 3).toFixed(1)}, wp.y) * (1.0 - smoothstep(${(START_Z + 4).toFixed(1)}, ${(START_Z + 9).toFixed(1)}, wp.y));
      float clr = 1.0 - smoothstep(uTable.y - 1.2, uTable.y + 0.6 + fbm(wp) , length(wp - uTable.xz));
      float m = max(onPath, clr * 0.92);
      diffuseColor.rgb *= mix(grass, dirt, m);
    `);
  };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), mat);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);
}

// ---------------------------------------------------------------------------
// Herbe en touffes et fleurs (modèles EZ-Tree), avec un peu de vent
// ---------------------------------------------------------------------------
const windShaders = [];
function addWind(material, strength) {
  material.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = { value: 0 };
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        vec3 wpos = (instanceMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
      #else
        vec3 wpos = (modelMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
      #endif
      float ph = wpos.x * 0.35 + wpos.z * 0.27;
      float sway = sin(uTime * 1.6 + ph) * 0.6 + sin(uTime * 2.7 + ph * 1.7) * 0.4;
      transformed.x += position.y * ${strength.toFixed(3)} * sway;
      transformed.z += position.y * ${(strength * 0.6).toFixed(3)} * cos(uTime * 1.3 + ph);`);
    windShaders.push(sh);
  };
}

function grassTexture() {
  const W = 256, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), r = rnd(5);
  for (let i = 0; i < 70; i++) {
    const x0 = W / 2 + (r() - 0.5) * W * 0.8, h = H * (0.45 + r() * 0.55), bend = (r() - 0.5) * 60, w = 3 + r() * 5;
    const hue = 70 + r() * 30, sat = 35 + r() * 25, l0 = 16 + r() * 10, l1 = l0 + 18 + r() * 14;
    const grd = g.createLinearGradient(0, H, 0, H - h);
    grd.addColorStop(0, `hsl(${hue},${sat}%,${l0}%)`); grd.addColorStop(1, `hsl(${hue - 8},${sat + 5}%,${l1}%)`);
    g.fillStyle = grd; g.beginPath();
    g.moveTo(x0 - w, H); g.quadraticCurveTo(x0 - w * 0.6 + bend * 0.3, H - h * 0.55, x0 + bend, H - h);
    g.quadraticCurveTo(x0 + w * 0.6 + bend * 0.3, H - h * 0.55, x0 + w, H); g.closePath(); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function makeGrass(flowers) {
  // une touffe = trois plans croisés
  const parts = [0, 1, 2].map((k) => { const p = new THREE.PlaneGeometry(1, 1); p.translate(0, 0.5, 0); p.rotateY((k * Math.PI) / 3); return p; });
  const geo = mergeGeometries(parts);
  const nrm = geo.attributes.normal; for (let i = 0; i < nrm.count; i++) nrm.setXYZ(i, 0, 1, 0); // éclairage doux, comme un tapis d'herbe
  const mat = new THREE.MeshStandardMaterial({ map: grassTexture(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1, metalness: 0 });
  addWind(mat, 0.09);
  const max = TOUCH ? 14000 : 30000;
  const mesh = new THREE.InstancedMesh(geo, mat, max);
  const d = new THREE.Object3D(), col = new THREE.Color(), r = rnd(3);
  let n = 0;
  for (let i = 0; i < max * 3 && n < max; i++) {
    const z = 18 - r() * 112, x = pathX(Math.max(z, END_Z)) + (r() * 2 - 1) * 28;
    if (onPath(x, z, 0.05)) continue;
    const dist = Math.min(Math.abs(x - pathX(Math.max(z, END_Z))), Math.hypot(x - TABLE.x, z - TABLE.z));
    if (r() > 1.25 - dist / 30) continue; // plus dense près du chemin et de la clairière
    d.position.set(x, 0, z);
    d.rotation.set(0, r() * Math.PI * 2, 0);
    const h = 0.22 + r() * 0.3;
    d.scale.set(h * (1.3 + r() * 0.8), h, h * (1.3 + r() * 0.8));
    d.updateMatrix(); mesh.setMatrixAt(n, d.matrix);
    const v = 0.8 + r() * 0.35; mesh.setColorAt(n, col.setRGB(v * (0.95 + r() * 0.15), v, v * 0.8));
    n++;
  }
  mesh.count = n; mesh.receiveShadow = true; mesh.castShadow = !TOUCH;
  scene.add(mesh);

  // Fleurs : une instance par sous-objet du modèle, pour garder peu d'appels de rendu
  flowers.forEach((gl, k) => {
    const proto = gl.scene; proto.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(proto), fh = box.max.y - box.min.y;
    const r2 = rnd(40 + k), mats = [], d2 = new THREE.Object3D();
    for (let i = 0; i < 70; i++) {
      const z = 10 - r2() * 80, x = pathX(z) + (r2() < 0.5 ? -1 : 1) * (2 + r2() * 9);
      if (onPath(x, z, 0.3)) continue;
      d2.position.set(x, 0, z); d2.rotation.set(0, r2() * 6.28, 0); d2.scale.setScalar((0.22 + r2() * 0.18) / fh); d2.updateMatrix();
      mats.push(d2.matrix.clone());
    }
    proto.traverse((o) => {
      if (!o.isMesh) return;
      const mat = o.material.map ? new THREE.MeshStandardMaterial({ map: o.material.map, roughness: 1, alphaTest: 0.5, side: THREE.DoubleSide }) : o.material;
      const im = new THREE.InstancedMesh(o.geometry, mat, mats.length), tmpM = new THREE.Matrix4();
      mats.forEach((m, i) => im.setMatrixAt(i, tmpM.multiplyMatrices(m, o.matrixWorld)));
      im.receiveShadow = true; scene.add(im);
    });
  });
}

// ---------------------------------------------------------------------------
// Les arbres (EZ-Tree) : quelques modèles générés, puis répétés le long de l'allée
// ---------------------------------------------------------------------------
const trunks = []; // pour les collisions : { x, z, r }
const treeSources = [];
const treeSets = []; // par modèle : instances proches (détaillées) et lointaines (allégées)
const NEAR = TOUCH ? 26 : 38, FAR = TOUCH ? 85 : 115;

// Le feuillage d'EZ-Tree a son propre shader de vent : on lui apprend l'instanciation.
function instancedLeaves(mat) {
  const orig = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    orig(sh, r);
    sh.vertexShader = sh.vertexShader.replace('vec4 mvPosition = vec4(transformed, 1.0);',
      '#ifdef USE_INSTANCING\n vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);\n#else\n vec4 mvPosition = vec4(transformed, 1.0);\n#endif');
  };
}

async function makeTrees(onProgress) {
  const bark = barkTextures();
  const leaves = { oak: leafTexture('oak', 11), ash: leafTexture('ash', 21), aspen: leafTexture('aspen', 31) };
  const kinds = [
    ['Oak Large', 101, 'oak'], ['Ash Large', 202, 'ash'], ['Oak Medium', 303, 'oak'],
    ['Aspen Large', 404, 'aspen'], ['Ash Medium', 505, 'ash'], ['Oak Large', 606, 'oak']
  ];
  const variants = [];
  for (let i = 0; i < kinds.length; i++) {
    const [preset, seed, leaf] = kinds[i];
    const t = new Tree();
    t.options.copy(structuredClone(TreePreset[preset]));
    t.options.seed = seed;
    t.options.bark.textured = true;
    t.options.bark.maps = { color: bark.color, normal: bark.normal, roughness: null, ao: null };
    t.options.bark.tint = 0xffffff;
    t.options.leaves.map = leaves[leaf];
    t.options.leaves.alphaTest = 0.45;
    t.generate();
    instancedLeaves(t.leavesMesh.material);
    t.leavesMesh.material.alphaToCoverage = true;
    const lo = t.createGeometry({ sectionStride: 5, segmentFactor: 0.4, leafStride: 2, leafScale: 1.3, billboard: 'single' });
    t.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(t);
    variants.push({ tree: t, lo, height: box.max.y - box.min.y, items: [] });
    treeSources.push(t);
    onProgress((i + 1) / (kinds.length + 1));
    await new Promise((r) => requestAnimationFrame(r));
  }

  const r = rnd(9), d = new THREE.Object3D();
  function place(x, z, height, v) {
    const src = variants[v % variants.length];
    d.position.set(x, 0, z); d.rotation.set(0, r() * Math.PI * 2, 0); d.scale.setScalar(height / src.height); d.updateMatrix();
    src.items.push({ x, z, m: d.matrix.clone() });
    trunks.push({ x, z, r: 0.45 });
  }
  // L'allée : deux rangées régulières
  let v = 0;
  for (let z = START_Z + 2; z > END_Z + 3; z -= 6.5 + r() * 1.5) {
    for (const side of [-1, 1]) {
      const x = pathX(z) + side * (3.6 + r() * 0.6);
      place(x, z + (r() - 0.5), 14 + r() * 5, v++);
    }
  }
  // Autour de la clairière
  for (let a = 0; a < Math.PI * 2; a += 0.55 + r() * 0.3) {
    if (Math.abs(a - Math.PI / 2) < 0.6) continue; // l'entrée de la clairière, côté allée
    const rr = CLEARING_R + 3 + r() * 4;
    place(TABLE.x + Math.cos(a) * rr, TABLE.z + Math.sin(a) * rr, 13 + r() * 6, v++);
  }
  // La forêt, plus loin
  for (let i = 0; i < 260; i++) {
    const z = 40 - r() * 160, side = r() < 0.5 ? -1 : 1, off = 8 + Math.pow(r(), 0.7) * 60;
    const x = pathX(Math.max(z, END_Z)) + side * off;
    if (Math.hypot(x - TABLE.x, z - TABLE.z) < CLEARING_R + 7) continue;
    if (z > START_Z + 6 && Math.abs(x - pathX(z)) < 6) continue; // dégager la vue derrière le départ
    place(x, z, 13 + r() * 10, v++);
  }
  // Fermer le décor : derrière la clairière, et loin derrière le départ
  for (let i = 0; i < 90; i++) {
    const back = i < 60, z = back ? TABLE.z - 13 - r() * 50 : START_Z + 14 + r() * 30;
    const x = pathX(back ? END_Z : START_Z) + (r() * 2 - 1) * 30;
    place(x, z, 13 + r() * 10, v++);
  }

  for (const src of variants) {
    const n = src.items.length, bm = src.tree.branchesMesh.material, lm = src.tree.leavesMesh.material;
    const mk = (geo, mat, shadow) => {
      const m = new THREE.InstancedMesh(geo, mat, n); m.count = 0; m.frustumCulled = false;
      m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
    };
    treeSets.push({
      items: src.items,
      near: [mk(src.tree.branchesMesh.geometry, bm, true), mk(src.tree.leavesMesh.geometry, lm, true)],
      far: [mk(src.lo.branches, bm, false), mk(src.lo.leaves, lm, false)]
    });
  }
  updateTreeLOD(true);
  onProgress(1);
}

// Les arbres proches du joueur sont détaillés et portent des ombres, les autres sont allégés.
const lodAt = new THREE.Vector3(1e9, 0, 0);
function updateTreeLOD(force) {
  const p = camera.position;
  if (!force && Math.hypot(p.x - lodAt.x, p.z - lodAt.z) < 3) return;
  lodAt.copy(p);
  for (const set of treeSets) {
    let a = 0, b = 0;
    for (const it of set.items) {
      const dist = Math.hypot(it.x - p.x, it.z - p.z);
      if (dist > FAR) continue; // perdu dans la brume
      const near = dist < NEAR;
      const meshes = near ? set.near : set.far, k = near ? a++ : b++;
      meshes[0].setMatrixAt(k, it.m); meshes[1].setMatrixAt(k, it.m);
    }
    set.near.forEach((m) => { m.count = a; m.instanceMatrix.needsUpdate = true; });
    set.far.forEach((m) => { m.count = b; m.instanceMatrix.needsUpdate = true; });
  }
}

// ---------------------------------------------------------------------------
// La table, la chaise et l'ordinateur
// ---------------------------------------------------------------------------
let screenMesh, seatPos, sitTarget;
function makeDesk(wood, siteTex) {
  const [wd, wb, wr] = wood;
  [wd, wb, wr].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.repeat.set(1.6, 1); });
  wd.colorSpace = THREE.SRGBColorSpace;
  const woodMat = new THREE.MeshStandardMaterial({ map: wd, bumpMap: wb, bumpScale: 0.6, roughnessMap: wr, roughness: 0.85, color: 0xc9a982 });
  const darkWood = woodMat.clone(); darkWood.color = new THREE.Color(0x8a6a4a);
  const desk = new THREE.Group();
  const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; desk.add(m); return m; };

  // Table
  box(1.5, 0.05, 0.85, woodMat, 0, 0.75, 0);
  for (const [x, z] of [[-0.68, -0.36], [0.68, -0.36], [-0.68, 0.36], [0.68, 0.36]]) box(0.06, 0.73, 0.06, darkWood, x, 0.365, z);
  box(1.3, 0.06, 0.03, darkWood, 0, 0.66, -0.36); box(1.3, 0.06, 0.03, darkWood, 0, 0.66, 0.36);

  // Chaise, côté allée, tournée vers la table
  const cz = 0.72;
  box(0.46, 0.04, 0.44, woodMat, 0, 0.46, cz);
  for (const [x, z] of [[-0.2, cz - 0.19], [0.2, cz - 0.19], [-0.2, cz + 0.19], [0.2, cz + 0.19]]) box(0.04, 0.46, 0.04, darkWood, x, 0.23, z);
  for (const x of [-0.2, 0.2]) box(0.04, 0.48, 0.04, darkWood, x, 0.7, cz + 0.2);
  box(0.44, 0.16, 0.025, woodMat, 0, 0.82, cz + 0.2);

  // Mug
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.095, 24), new THREE.MeshStandardMaterial({ color: 0xece8e0, roughness: 0.35 }));
  mug.position.set(0.38, 0.8225, 0.12); mug.castShadow = true; desk.add(mug);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.008, 10, 20), mug.material);
  handle.position.set(0.425, 0.825, 0.12); handle.rotation.y = Math.PI / 2; desk.add(handle);

  // Ordinateur portable
  const alu = new THREE.MeshStandardMaterial({ color: 0xbfc2c7, metalness: 0.85, roughness: 0.32 });
  const keys = new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.6 });
  const lap = new THREE.Group(); lap.position.set(0, 0.775, 0.12); desk.add(lap);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.014, 0.235), alu); base.position.y = 0.007; base.castShadow = true; lap.add(base);
  const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.1), keys); kb.rotation.x = -Math.PI / 2; kb.position.set(0, 0.0145, -0.03); lap.add(kb);
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.065), new THREE.MeshStandardMaterial({ color: 0xa9acb1, metalness: 0.6, roughness: 0.25 }));
  pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.0146, 0.07); lap.add(pad);
  const hinge = new THREE.Group(); hinge.position.set(0, 0.014, -0.1175); lap.add(hinge);
  hinge.rotation.x = THREE.MathUtils.degToRad(-12); // écran ouvert à ~102°
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.225, 0.006), alu); lid.position.set(0, 0.1125, -0.003); lid.castShadow = true; hinge.add(lid);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.215), new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: 0.4 }));
  bezel.position.set(0, 0.1125, 0.0002); hinge.add(bezel);
  siteTex.colorSpace = THREE.SRGBColorSpace; siteTex.anisotropy = 8;
  screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3136, 0.196), new THREE.MeshBasicMaterial({ map: siteTex, toneMapped: false, color: 0xdedede }));
  screenMesh.position.set(0, 0.1155, 0.0004); hinge.add(screenMesh);

  desk.position.copy(TABLE);
  desk.rotation.y = 0; // la chaise regarde vers -z, comme le joueur qui arrive
  scene.add(desk);
  desk.updateMatrixWorld(true);
  seatPos = new THREE.Vector3(0, 0, cz).applyMatrix4(desk.matrixWorld);
  sitTarget = new THREE.Vector3(0, 0, cz + 0.35).applyMatrix4(desk.matrixWorld); // où se tenir pour s'asseoir
  // Collisions : la table, et la chaise
  trunks.push({ x: TABLE.x - 0.5, z: TABLE.z, r: 0.5 }, { x: TABLE.x, z: TABLE.z, r: 0.5 }, { x: TABLE.x + 0.5, z: TABLE.z, r: 0.5 });
}

// ---------------------------------------------------------------------------
// Le personnage
// ---------------------------------------------------------------------------
const player = { pos: new THREE.Vector3(pathX(START_Z), 0, START_Z), yaw: Math.PI, speed: 0 };
let model, mixer, actions = {}, MODEL_YAW = 0;
const bakedClips = [];
// Avatar (Ready Player Me) animé avec les clips Mixamo du modèle « Soldier ».
// Les deux squelettes n'ont pas la même pose de repos : on transfère, os par os,
// la rotation par rapport à la pose de repos, en coordonnées monde.
function retarget(avatar, src, clip, restClip) {
  const srcRoot = src.scene, tgtRoot = avatar.scene;
  const tgtSkin = []; tgtRoot.traverse((o) => { if (o.isSkinnedMesh) tgtSkin.push(o); });
  const bones = tgtSkin[0].skeleton.bones;
  tgtSkin.forEach((m) => m.skeleton.pose());
  tgtRoot.updateMatrixWorld(true);
  const srcBone = (n) => srcRoot.getObjectByName('mixamorig' + n) || srcRoot.getObjectByName('mixamorig:' + n);
  const pairs = bones.map((b) => ({ b, s: srcBone(b.name) })).filter((p) => p.s);
  const tgtRestW = new Map(pairs.map((p) => [p.b, p.b.getWorldQuaternion(new THREE.Quaternion())]));
  const tgtHip = bones.find((b) => b.name === 'Hips'), tgtHipY = tgtHip.getWorldPosition(new THREE.Vector3()).y;

  const mixer = new THREE.AnimationMixer(srcRoot);
  const sampleSrc = (c, t) => { mixer.stopAllAction(); const a = mixer.clipAction(c); a.play(); mixer.setTime(t); srcRoot.updateMatrixWorld(true); };
  if (restClip) sampleSrc(restClip, 0);
  else { mixer.stopAllAction(); srcRoot.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.pose(); }); srcRoot.updateMatrixWorld(true); }
  const srcRestW = new Map(pairs.map((p) => [p.b, p.s.getWorldQuaternion(new THREE.Quaternion())]));
  const srcHip = srcBone('Hips'), srcHipY = srcHip.getWorldPosition(new THREE.Vector3()).y;

  // Le modèle source regarde vers -z, l'avatar vers +z : on tourne les rotations de 180° autour de y.
  const R = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI), Ri = R.clone().invert();
  // Pose A (avatar) contre pose T (source) : on aligne chaque os sur la direction de l'os source au repos.
  const firstChild = (bone, list) => bone.children.find((c) => c.isBone && list.includes(c));
  const tb = pairs.map((p) => p.b), sb = pairs.map((p) => p.s);
  const align = new Map();
  for (const p of pairs) {
    const tc = firstChild(p.b, tb), sp = pairs.find((x) => x.b === tc);
    if (!tc || !sp) { align.set(p.b, align.get(p.b.parent) || new THREE.Quaternion()); continue; }
    const tDir = tc.getWorldPosition(new THREE.Vector3()).sub(p.b.getWorldPosition(new THREE.Vector3())).normalize();
    const sDir = sp.s.getWorldPosition(new THREE.Vector3()).sub(p.s.getWorldPosition(new THREE.Vector3())).normalize().applyQuaternion(R);
    align.set(p.b, new THREE.Quaternion().setFromUnitVectors(tDir, sDir));
  }
  const fps = 30, n = Math.max(2, Math.round(clip.duration * fps) + 1);
  const times = new Float32Array(n), q = new Map(pairs.map((p) => [p.b, new Float32Array(n * 4)])), hipPos = new Float32Array(n * 3);
  const restLocalHip = tgtHip.position.clone();
  const qw = new THREE.Quaternion(), qd = new THREE.Quaternion(), qp = new THREE.Quaternion(), worldNow = new Map(), hp = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const t = Math.min(clip.duration, i / fps); times[i] = t;
    sampleSrc(clip, t);
    worldNow.clear();
    for (const p of pairs) { // les os sont rangés parents d'abord
      p.s.getWorldQuaternion(qw);
      qd.copy(qw).multiply(srcRestW.get(p.b).clone().invert()); // rotation depuis la pose de repos
      qd.premultiply(R).multiply(Ri);
      const tw = qd.clone().multiply(align.get(p.b)).multiply(tgtRestW.get(p.b));
      worldNow.set(p.b, tw);
      const parentW = worldNow.get(p.b.parent) || p.b.parent.getWorldQuaternion(qp.clone());
      const local = parentW.clone().invert().multiply(tw);
      q.get(p.b).set([local.x, local.y, local.z, local.w], i * 4);
    }
    srcHip.getWorldPosition(hp);
    const dy = (hp.y - srcHipY) * (tgtHipY / srcHipY);
    hipPos.set([restLocalHip.x, restLocalHip.y + dy / (tgtHip.parent.getWorldScale(new THREE.Vector3()).y || 1), restLocalHip.z], i * 3);
  }
  mixer.stopAllAction();
  const tracks = pairs.map((p) => new THREE.QuaternionKeyframeTrack(p.b.name + '.quaternion', times, q.get(p.b)));
  tracks.push(new THREE.VectorKeyframeTrack('Hips.position', times, hipPos));
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}
function makePlayer(avatarGltf, animGltf, baked) {
  model = avatarGltf.scene;
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    if (/Outfit_Top/.test(o.name)) o.material.color.setRGB(0.5, 0.58, 0.72); // veste bleu ardoise plutôt que rose
    if (/Outfit_Bottom/.test(o.name)) o.material.color.setRGB(0.42, 0.46, 0.55);
  });
  const rest = null;
  mixer = new THREE.AnimationMixer(model);
  ['Idle', 'Walk', 'Run'].forEach((name) => {
    let clip;
    if (baked) clip = THREE.AnimationClip.parse(baked.find((c) => c.name === name));
    else { const src = animGltf.animations.find((c) => c.name === name); if (src) clip = retarget(avatarGltf, animGltf, src, rest); }
    if (clip) { actions[name] = mixer.clipAction(clip); bakedClips.push(clip); }
  });
  scene.add(model);
  ['Idle', 'Walk', 'Run'].forEach((n) => { if (actions[n]) { actions[n].play(); actions[n].setEffectiveWeight(n === 'Idle' ? 1 : 0); } });
}
const weights = { Idle: 1, Walk: 0, Run: 0 };
function animate(dt) {
  const s = player.speed;
  const target = s < 0.15 ? { Idle: 1, Walk: 0, Run: 0 } : s < 2.6 ? { Idle: 0, Walk: 1, Run: 0 } : { Idle: 0, Walk: 0, Run: 1 };
  for (const k in weights) {
    weights[k] = lerp(weights[k], target[k], Math.min(1, dt * 6));
    if (actions[k]) actions[k].setEffectiveWeight(weights[k]);
  }
  if (actions.Walk) actions.Walk.setEffectiveTimeScale(THREE.MathUtils.clamp(s / 1.6, 0.6, 1.4));
  if (actions.Run) actions.Run.setEffectiveTimeScale(THREE.MathUtils.clamp(s / 4.2, 0.7, 1.2));
  mixer.update(dt);
}

// ---------------------------------------------------------------------------
// Commandes : clavier, souris, tactile
// ---------------------------------------------------------------------------
const keys = new Set();
addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('input,textarea')) return;
  keys.add(e.code);
  if (e.code === 'KeyE' && !$('sit').hidden) sitDown();
  if (e.code === 'Escape' && state === 'seated') standUp();
  if (e.code === 'Enter' && state === 'seated') openSite();
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => keys.clear());

const cam = { yaw: 0, pitch: 0.18, dist: 4.2 };
let drag = null;
const stick = { id: null, x: 0, y: 0, dx: 0, dy: 0 };
canvas.addEventListener('pointerdown', (e) => {
  if (state === 'seated') { if (hoverScreen(e)) openSite(); return; }
  if (state !== 'walk') return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth * 0.45 && stick.id === null) {
    stick.id = e.pointerId; stick.x = e.clientX; stick.y = e.clientY; stick.dx = stick.dy = 0;
    const el = $('stick'); el.hidden = false; el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px'; el.firstChild.style.transform = '';
  } else if (!drag) {
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    canvas.classList.add('grabbing');
  }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (state === 'seated') { canvas.classList.toggle('point', hoverScreen(e)); return; }
  if (e.pointerId === stick.id) {
    let dx = e.clientX - stick.x, dy = e.clientY - stick.y; const l = Math.hypot(dx, dy), m = 50;
    if (l > m) { dx *= m / l; dy *= m / l; }
    stick.dx = dx / m; stick.dy = dy / m;
    $('stick').firstChild.style.transform = `translate(${dx}px,${dy}px)`;
  } else if (drag && e.pointerId === drag.id) {
    cam.yaw -= (e.clientX - drag.x) * 0.005;
    cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - drag.y) * 0.003, -0.15, 0.7);
    drag.x = e.clientX; drag.y = e.clientY;
  }
});
function release(e) {
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; $('stick').hidden = true; }
  if (drag && e.pointerId === drag.id) { drag = null; canvas.classList.remove('grabbing'); }
}
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);
canvas.addEventListener('wheel', (e) => { cam.dist = THREE.MathUtils.clamp(cam.dist + e.deltaY * 0.003, 2.6, 7); }, { passive: true });

// ---------------------------------------------------------------------------
// Déplacement et caméra à la troisième personne
// ---------------------------------------------------------------------------
const tmp = new THREE.Vector3(), camTarget = new THREE.Vector3();
function move(dt) {
  let fx = 0, sx = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) fx += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) fx -= 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) sx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) sx += 1;
  if (stick.id !== null) { fx = -stick.dy; sx = stick.dx; }
  const amt = Math.min(1, Math.hypot(fx, sx));
  const run = keys.has('ShiftLeft') || keys.has('ShiftRight') || (stick.id !== null && amt > 0.92);
  const want = amt > 0.05 ? (run ? 4.4 : 1.7) * (stick.id !== null ? Math.max(amt, 0.5) : 1) : 0;
  player.speed = lerp(player.speed, want, Math.min(1, dt * (want > player.speed ? 5 : 8)));
  if (amt > 0.05) {
    // direction relative à la caméra
    const fwd = new THREE.Vector2(-Math.sin(cam.yaw), -Math.cos(cam.yaw)), right = new THREE.Vector2(Math.cos(cam.yaw), -Math.sin(cam.yaw));
    const dir = fwd.multiplyScalar(fx).add(right.multiplyScalar(sx)).normalize();
    const targetYaw = Math.atan2(dir.x, dir.y);
    let d = targetYaw - player.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    player.yaw += d * Math.min(1, dt * 10);
  }
  const step = player.speed * dt;
  player.pos.x += Math.sin(player.yaw) * step;
  player.pos.z += Math.cos(player.yaw) * step;
  // collisions avec les troncs et la table
  for (const t of trunks) {
    const dx = player.pos.x - t.x, dz = player.pos.z - t.z, l = Math.hypot(dx, dz), m = t.r + 0.3;
    if (l < m && l > 1e-4) { player.pos.x = t.x + dx / l * m; player.pos.z = t.z + dz / l * m; }
  }
  player.pos.z = THREE.MathUtils.clamp(player.pos.z, TABLE.z - 8, START_Z + 8);
  const cx = pathX(player.pos.z); player.pos.x = THREE.MathUtils.clamp(player.pos.x, cx - 12, cx + 12);

  // la caméra suit doucement quand on avance
  if (!drag && player.speed > 0.3 && fx > 0) {
    let d = (player.yaw + Math.PI) - cam.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    cam.yaw += d * Math.min(1, dt * 0.8);
  }
}
function followCamera(dt, snap) {
  camTarget.set(player.pos.x, 1.45, player.pos.z);
  const h = Math.cos(cam.pitch) * cam.dist;
  tmp.set(camTarget.x + Math.sin(cam.yaw) * h, camTarget.y + Math.sin(cam.pitch) * cam.dist + 0.2, camTarget.z + Math.cos(cam.yaw) * h);
  tmp.y = Math.max(tmp.y, 0.4);
  if (snap) camera.position.copy(tmp); else camera.position.lerp(tmp, Math.min(1, dt * 8));
  camera.lookAt(camTarget);
}

// ---------------------------------------------------------------------------
// S'asseoir, l'écran, le portfolio
// ---------------------------------------------------------------------------
let state = 'loading';
let tween = null; // { from pos/quat, to pos/quat, t, dur, done }
function tweenCamera(toPos, lookAt, dur, done) {
  const m = new THREE.Matrix4().lookAt(toPos, lookAt, new THREE.Vector3(0, 1, 0));
  tween = { p0: camera.position.clone(), q0: camera.quaternion.clone(), p1: toPos.clone(), q1: new THREE.Quaternion().setFromRotationMatrix(m), t: 0, dur, done };
}
function screenCenter() { return screenMesh.getWorldPosition(new THREE.Vector3()); }
function sitDown() {
  if (state !== 'walk') return;
  state = 'sitting';
  $('sit').hidden = true; $('goal').hidden = true; keys.clear(); stick.id = null; $('stick').hidden = true;
  player.speed = 0;
  const eye = seatPos.clone().setY(1.17).add(new THREE.Vector3(0, 0, 0.06));
  tweenCamera(eye, screenCenter().add(new THREE.Vector3(0, -0.04, 0)), 1.6, () => { state = 'seated'; $('seated').hidden = false; });
  setTimeout(() => { if (model) model.visible = false; }, 650);
}
function standUp() {
  if (state !== 'seated') return;
  state = 'standing'; $('seated').hidden = true;
  player.pos.copy(sitTarget).add(new THREE.Vector3(0, 0, 0.5)); player.yaw = 0; cam.yaw = Math.PI; cam.pitch = 0.2;
  if (model) model.visible = true;
  const h = Math.cos(cam.pitch) * cam.dist;
  const to = new THREE.Vector3(player.pos.x + Math.sin(cam.yaw) * h, 1.45 + Math.sin(cam.pitch) * cam.dist + 0.2, player.pos.z + Math.cos(cam.yaw) * h);
  tweenCamera(to, new THREE.Vector3(player.pos.x, 1.45, player.pos.z), 1.2, () => { state = 'walk'; });
}
function openSite() {
  if (state !== 'seated') return;
  state = 'opening'; $('seated').hidden = true;
  // cadrer l'écran pour qu'il remplisse la fenêtre
  const c = screenCenter(), n = new THREE.Vector3(0, 0, 1).applyQuaternion(screenMesh.getWorldQuaternion(new THREE.Quaternion()));
  const halfV = THREE.MathUtils.degToRad(camera.fov / 2), sw = 0.3136, sh = 0.196;
  const dist = Math.min((sh / 2) / Math.tan(halfV), (sw / 2) / (Math.tan(halfV) * camera.aspect)) * 0.98;
  tweenCamera(c.clone().addScaledVector(n, dist), c, 1.3, () => {
    $('fade').classList.add('on');
    setTimeout(() => { location.href = '/'; }, 420);
  });
}
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function hoverScreen(e) {
  if (!screenMesh) return false;
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObject(screenMesh).length > 0;
  screenMesh.material.color.setHex(hit ? 0xffffff : 0xdedede);
  return hit;
}
$('sit').addEventListener('click', sitDown);
$('stand').addEventListener('click', standUp);
$('open').addEventListener('click', openSite);
$('credits-btn').addEventListener('click', () => { $('credits').hidden = false; });
$('credits-close').addEventListener('click', () => { $('credits').hidden = true; });
$('credits').addEventListener('click', (e) => { if (e.target.id === 'credits') $('credits').hidden = true; });
// retour arrière depuis le portfolio : ne pas rester sur l'écran blanc
addEventListener('pageshow', (e) => { if (e.persisted) { $('fade').classList.remove('on'); if (state === 'opening') { state = 'seated'; $('seated').hidden = false; } } });

// ---------------------------------------------------------------------------
// Boucle
// ---------------------------------------------------------------------------
const clock = new THREE.Clock();
let goalTimer = 0;
const MANUAL = location.search.includes('manual');
let simT = 0;
function frame(fixed) {
  let dt, t;
  if (MANUAL) { dt = typeof fixed === 'number' ? fixed : 0; simT += dt; t = simT; } else { dt = Math.min(clock.getDelta(), 0.05); t = clock.elapsedTime; }
  if (state === 'walk') { move(dt); followCamera(dt, false); }
  if (model) {
    model.position.copy(player.pos); model.rotation.y = player.yaw + MODEL_YAW;
    if (state === 'walk' || state === 'ready' || state === 'standing') animate(dt);
  }
  if (tween) {
    tween.t += dt / tween.dur; const k = ease(Math.min(1, tween.t));
    camera.position.lerpVectors(tween.p0, tween.p1, k);
    camera.quaternion.slerpQuaternions(tween.q0, tween.q1, k);
    if (tween.t >= 1) { const d = tween.done; tween = null; d && d(); }
  }
  if (state === 'walk') {
    const near = Math.hypot(player.pos.x - sitTarget.x, player.pos.z - sitTarget.z) < 1.7;
    $('sit').hidden = !near;
    if (goalTimer && t > goalTimer) { $('goal').classList.add('gone'); goalTimer = 0; }
  }
  // l'ombre suit le joueur
  sun.target.position.set(player.pos.x, 0, player.pos.z - 6);
  sun.position.copy(sun.target.position).addScaledVector(sunDir, 80);
  updateTreeLOD(false);
  treeSources.forEach((tr) => tr.update(t));
  windShaders.forEach((sh) => { sh.uniforms.uTime.value = t; });
  if (!MANUAL || fixed === 'draw') renderer.render(scene, camera);
  if (!MANUAL) requestAnimationFrame(() => frame());
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------------------------------------------------------------------------
// Chargement
// ---------------------------------------------------------------------------
function progress(p) {
  $('bar').style.width = Math.round(p * 100) + '%';
  $('loading-text').textContent = (p < 0.15 ? 'Chargement du décor… ' : 'Les arbres poussent… ') + Math.round(p * 100) + ' %';
}
async function init() {
  progress(0.02);
  const tl = new THREE.TextureLoader(), gl = new GLTFLoader();
  const [hdr, grassTex, wd, wb, wr, site, soldier, avatar, fw, fy] = await Promise.all([
    new RGBELoader().loadAsync(A + 'forest.hdr'),
    tl.loadAsync(A + 'grass.jpg'), tl.loadAsync(A + 'wood_diffuse.jpg'), tl.loadAsync(A + 'wood_bump.jpg'), tl.loadAsync(A + 'wood_roughness.jpg'),
    tl.loadAsync(A + 'site.jpg'),
    (location.search.includes('rebake') ? gl.loadAsync(A + 'Soldier.glb') : fetch(A + 'avatar-anims.json').then((r) => r.json())), gl.loadAsync(A + 'avatar.glb'), gl.loadAsync(A + 'flower_white.glb'), gl.loadAsync(A + 'flower_yellow.glb')
  ]);
  progress(0.12);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(hdr).texture; pm.dispose();
  if (location.search.includes('hdrbg')) { hdr.mapping = THREE.EquirectangularReflectionMapping; scene.background = hdr; sky.visible = false; }
  scene.environmentIntensity = 0.45;

  makeGround(grassTex);
  makeGrass([fw, fy]);
  makeDesk([wd, wb, wr], site);
  if (Array.isArray(soldier)) makePlayer(avatar, null, soldier); else makePlayer(avatar, soldier);
  await makeTrees((p) => progress(0.12 + p * 0.86));

  model.position.copy(player.pos); model.rotation.y = player.yaw + MODEL_YAW;
  cam.yaw = 0;
  followCamera(0, true);
  renderer.compile(scene, camera);
  state = 'ready';
  frame();
  $('loading').hidden = true; $('ready').hidden = false;
  $('start').focus();
}
if (TOUCH) $('seated').querySelector('p').textContent = "Touche l'écran de l'ordinateur";
$('start').addEventListener('click', () => {
  $('intro').classList.add('gone');
  setTimeout(() => { $('intro').hidden = true; }, 650);
  state = 'walk';
  canvas.classList.add('grab');
  $('goal').hidden = false; goalTimer = clock.elapsedTime + 6;
  canvas.focus();
});
if (location.search.includes('debug')) window.__b = { bakedClips, treeSets, renderer, scene, player, cam, sitDown, standUp, openSite, keys, get state() { return state; }, step(n) { for (let i = 0; i < n; i++) frame(1 / 30); frame('draw'); } };
init().catch((e) => {
  console.error(e);
  $('loading').hidden = true; $('error').hidden = false;
});
