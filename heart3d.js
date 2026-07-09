// Continuous 3D heart for the FoCUS probe simulator.
// This is the "star-gazing" layer: the phone's motion continuously rotates a real
// anatomical heart in all directions (something fixed 2-D echo loops can't do),
// and the real Echopedia echo crossfades in on top when you steer onto a window.
//
// Model: "Realistic Human Heart" by neshallads, CC BY 4.0 (via Wikimedia Commons).
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

(function () {
  'use strict';
  var canvas = document.getElementById('heart3d');
  if (!canvas) return;

  var renderer, scene, camera, heart, raf = null;
  var started = false, modelReady = false;

  // Target look angles (radians) coming from the phone; we ease toward them so the
  // motion is smooth even though poses stream at ~16 Hz.
  var target = { rx: 0, ry: 0 };
  var current = { rx: 0, ry: 0 };
  var haveLook = false;            // until the first pose, idle-spin as an attract loop
  var idleYaw = 0;
  var clock = null;

  function size() {
    var host = canvas.parentElement;
    var w = host.clientWidth || 320, h = host.clientHeight || 320;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 2000);
    camera.position.set(0, 0, 3.1);

    // Lighting: warm key + cool fill + red rim for a fleshy, "wet tissue" read.
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var key = new THREE.DirectionalLight(0xfff2ea, 1.5); key.position.set(2, 3, 4); scene.add(key);
    var fill = new THREE.DirectionalLight(0x8fb6ff, 0.7); fill.position.set(-3, -1, 2); scene.add(fill);
    var rim = new THREE.DirectionalLight(0xff5a5a, 0.9); rim.position.set(-2, 2, -4); scene.add(rim);

    var loader = new STLLoader();
    loader.load('assets/heart.stl?v=20260709b', function (geo) {
      geo.computeVertexNormals();
      geo.center();
      geo.computeBoundingSphere();
      var r = (geo.boundingSphere && geo.boundingSphere.radius) || 1;
      var s = 1.25 / r;                          // frame the heart to ~80% of view
      var mat = new THREE.MeshStandardMaterial({
        color: 0xa5322f, roughness: 0.52, metalness: 0.08,
        emissive: 0x2a0707, emissiveIntensity: 0.35
      });
      heart = new THREE.Mesh(geo, mat);
      heart.scale.setScalar(s);
      // Most of these STLs import upright but facing away; nudge to an anatomical
      // "front" and let motion take over from there.
      heart.rotation.set(-0.35, 0.2, 0);
      scene.add(heart);
      modelReady = true;
    }, undefined, function () { /* load error: leave the CSS gradient void */ });

    window.addEventListener('resize', function () { if (renderer) size(); });
    size();
    clock = new THREE.Clock();
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!modelReady || !heart) { renderer.render(scene, camera); return; }
    var t = clock.getElapsedTime();

    if (haveLook) {
      current.rx += (target.rx - current.rx) * 0.12;
      current.ry += (target.ry - current.ry) * 0.12;
      heart.rotation.x = -0.35 + current.rx;
      heart.rotation.y = 0.2 + current.ry;
    } else {
      // attract mode: slow drift so it reads as alive before the phone connects
      idleYaw += 0.004;
      heart.rotation.y = 0.2 + Math.sin(idleYaw) * 0.6;
      heart.rotation.x = -0.35 + Math.sin(idleYaw * 0.6) * 0.12;
    }
    // gentle heartbeat pulse (~66 bpm) so it never looks like a frozen image
    var beat = 1 + 0.018 * Math.sin(t * Math.PI * 2 * 1.1);
    heart.scale.setScalar(heart.userData.base || (heart.userData.base = heart.scale.x));
    heart.scale.multiplyScalar(beat);

    renderer.render(scene, camera);
  }

  var Heart3D = {
    start: function () {
      if (started) return;
      started = true;
      init();
      frame();
    },
    // rx/ry in DEGREES from the phone (tilt & rock offsets from the calibration center)
    setLook: function (degX, degY) {
      if (typeof degX !== 'number' || typeof degY !== 'number') return;
      haveLook = true;
      target.ry = degX * 0.035;   // rock  -> yaw
      target.rx = degY * 0.035;   // tilt  -> pitch
    },
    resize: function () { if (renderer) size(); },
    isReady: function () { return started; }
  };
  window.Heart3D = Heart3D;
})();
