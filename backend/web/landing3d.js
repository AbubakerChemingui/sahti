/* Sahti landing — 3D hero (three.js r180, served locally).
   A slow cloud of pharmacy objects: two-tone capsules, scored tablets and a glass drop.
   It follows the pointer a little and opens up as you scroll. With reduced motion it renders one still frame. */
import * as THREE from "three";
import { RoomEnvironment } from "./vendor/three/RoomEnvironment.js";

function capsuleGeometry() {
  return new THREE.CapsuleGeometry(0.32, 0.9, 12, 32);
}

/* A two-tone capsule: one CapsuleGeometry, coloured per vertex by height. */
function capsule(colorA, colorB, envMap) {
  const geo = capsuleGeometry();
  const pos = geo.attributes.position;
  const colors = [];
  const a = new THREE.Color(colorA), b = new THREE.Color(colorB);
  for (let i = 0; i < pos.count; i++) {
    const c = pos.getY(i) > 0.0 ? a : b;
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, envMap, envMapIntensity: 1.1,
  });
  return new THREE.Mesh(geo, mat);
}

/* A round tablet with a score line, built from a lathe profile. */
function tablet(color, envMap) {
  const pts = [];
  const r = 0.55, h = 0.16;
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    pts.push(new THREE.Vector2(r * Math.sin((t * Math.PI) / 2) * 0.98 + 0.001, h * Math.cos((t * Math.PI) / 2) + 0.1));
  }
  pts.push(new THREE.Vector2(r, 0.1), new THREE.Vector2(r, -0.1));
  for (let i = 12; i >= 0; i--) {
    const t = i / 12;
    pts.push(new THREE.Vector2(r * Math.sin((t * Math.PI) / 2) * 0.98 + 0.001, -h * Math.cos((t * Math.PI) / 2) - 0.1));
  }
  const geo = new THREE.LatheGeometry(pts, 64);
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, sheen: 0.6, sheenColor: 0xffffff, clearcoat: 0.3, envMap, envMapIntensity: 0.8 });
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geo, mat));
  const score = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: 0xd9dee6, roughness: 0.6 }));
  score.position.y = 0.26;
  group.add(score);
  return group;
}

function glassDrop(envMap) {
  const geo = new THREE.SphereGeometry(0.5, 48, 48);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {           // pull the top into a drop shape
    const y = p.getY(i);
    if (y > 0) {
      const k = 1 - y / 0.5;
      p.setX(i, p.getX(i) * (0.35 + 0.65 * k));
      p.setZ(i, p.getZ(i) * (0.35 + 0.65 * k));
      p.setY(i, y * 1.7);
    }
  }
  geo.computeVertexNormals();
  // Glass look without transmission (transmission renders the scene twice; too heavy for low-end laptops).
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xbfe3ff, metalness: 0, roughness: 0.02, clearcoat: 1, clearcoatRoughness: 0, transparent: true, opacity: 0.55,
    envMap, envMapIntensity: 2.2, iridescence: 0.4,
  });
  return new THREE.Mesh(geo, mat);
}

export function mount(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fc4ff, 1.4); rim.position.set(-6, -2, -4); scene.add(rim);
  scene.add(new THREE.AmbientLight(0x9bb8d8, 0.35));

  const cloud = new THREE.Group();
  scene.add(cloud);
  const GREEN = 0x1aa260, WHITE = 0xf4f7fb, BLUE = 0x2e7fd1, SAND = 0xf1d9a7;
  const specs = [
    ["capsule", [GREEN, WHITE], [-3.4, 1.4, 0.5], 1.15],
    ["capsule", [BLUE, WHITE], [2.9, 2.0, -1.0], 1.0],
    ["capsule", [GREEN, WHITE], [3.6, -1.6, 0.8], 0.9],
    ["capsule", [SAND, WHITE], [-2.2, -2.3, -0.4], 0.85],
    ["tablet", WHITE, [-0.6, 2.7, -1.6], 1.0],
    ["tablet", WHITE, [1.2, -2.8, 0.2], 0.9],
    ["tablet", 0xfde7c4, [-4.5, -0.3, -2.2], 0.8],
    ["tablet", WHITE, [4.8, 0.4, -2.8], 0.75],
    ["capsule", [GREEN, WHITE], [0.6, 0.6, 1.2], 1.05],
    ["capsule", [BLUE, WHITE], [-1.4, 0.2, -3.6], 0.8],
  ];
  const items = specs.map(([kind, col, p, s], i) => {
    const m = kind === "capsule" ? capsule(col[0], col[1], env) : kind === "tablet" ? tablet(col, env) : glassDrop(env);
    m.position.set(...p);
    m.scale.setScalar(s);
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    m.userData = { base: new THREE.Vector3(...p), phase: i * 1.37, spin: 0.15 + (i % 4) * 0.06 };
    cloud.add(m);
    return m;
  });

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const layout = { squeeze: 0.55, offsetX: 3.1 };
  let progress = 0;          // 0 = hero, 1 = scrolled past: objects spread out and drift up
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 16 : 12;   // fit the cloud on phones
    // Wide screens: keep the left half clear for the headline. Narrow screens: centred, behind a scrim.
    const wide = w / h > 1.15;
    layout.squeeze = wide ? 0.55 : 0.8;
    const rtl = document.documentElement.dir === "rtl";   // the headline sits on the right in Arabic
    layout.offsetX = wide ? (rtl ? -3.1 : 3.1) : 0;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let visible = true, raf = 0, last = performance.now(), time = 0;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !reducedMotion) loop(); });
  io.observe(canvas);

  function frame(dt) {
    time += dt;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    cloud.rotation.y = pointer.x * 0.25 + progress * 0.6;
    cloud.rotation.x = pointer.y * 0.15;
    for (const m of items) {
      const u = m.userData;
      const spread = 1 + progress * 0.9;
      m.position.x = (u.base.x * layout.squeeze + layout.offsetX) * spread;
      m.position.y = u.base.y * spread + Math.sin(time * 0.6 + u.phase) * 0.18 + progress * 1.5;
      m.position.z = u.base.z + Math.cos(time * 0.5 + u.phase) * 0.12;
      m.rotation.x += dt * u.spin * 0.6;
      m.rotation.y += dt * u.spin;
    }
    renderer.render(scene, camera);
  }
  function loop() {
    raf = requestAnimationFrame(() => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      raf = 0;
      if (!visible) return;
      frame(dt);
      loop();
    });
  }
  if (reducedMotion) frame(0); else loop();

  return {
    setProgress(p) { progress = p; if (reducedMotion) frame(0); },
    destroy() {
      cancelAnimationFrame(raf); raf = 0; visible = false;
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}

window.Sahti3D = { mount };
window.dispatchEvent(new Event("sahti3d-ready"));
