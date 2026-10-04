/* =========================================================
   3D TRAVEL COMPASS PRELOADER
   Replaces the original globe animation.
   Keeps the existing #loadGlobe canvas and loader system.
========================================================= */

function startGlobe() {
  if (typeof THREE === 'undefined') return;

  var canvas = document.getElementById('loadGlobe');
  var loader = document.getElementById('load');

  if (!canvas || !loader) return;

  var renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
  } catch (e) {
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight, false);

  /* ---------------------------------------------------------
     SCENE
  --------------------------------------------------------- */

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    40,
    innerWidth / innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 0.15, 6.5);

  /* ---------------------------------------------------------
     LIGHTING
  --------------------------------------------------------- */

  scene.add(
    new THREE.HemisphereLight(
      0xc9dcf5,
      0x071225,
      1.4
    )
  );

  var keyLight = new THREE.DirectionalLight(
    0xffffff,
    1.8
  );

  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(
    0x6d9bd8,
    1.2
  );

  rimLight.position.set(-5, -3, -4);
  scene.add(rimLight);

  /* ---------------------------------------------------------
     MAIN COMPASS GROUP
  --------------------------------------------------------- */

  var compass = new THREE.Group();

  compass.rotation.x = 0.18;
  compass.rotation.z = -0.12;

  scene.add(compass);

  /* ---------------------------------------------------------
     COMPASS BODY
  --------------------------------------------------------- */

  var bodyGeometry = new THREE.CylinderGeometry(
    1.65,
    1.65,
    0.34,
    96
  );

  var bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x172b4d,
    metalness: 0.75,
    roughness: 0.28
  });

  var body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
  );

  body.rotation.x = Math.PI / 2;

  compass.add(body);

  /* ---------------------------------------------------------
     OUTER METAL RING
  --------------------------------------------------------- */

  var ringGeometry = new THREE.TorusGeometry(
    1.68,
    0.09,
    16,
    96
  );

  var ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9d0ea,
    metalness: 0.85,
    roughness: 0.2
  });

  var outerRing = new THREE.Mesh(
    ringGeometry,
    ringMaterial
  );

  compass.add(outerRing);

  /* ---------------------------------------------------------
     INNER NAVIGATION RING
  --------------------------------------------------------- */

  var innerRingGeometry = new THREE.TorusGeometry(
    1.36,
    0.018,
    8,
    96
  );

  var innerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fb4e6,
    transparent: true,
    opacity: 0.8
  });

  var innerRing = new THREE.Mesh(
    innerRingGeometry,
    innerRingMaterial
  );

  compass.add(innerRing);

  /* ---------------------------------------------------------
     COMPASS FACE
  --------------------------------------------------------- */

  var faceGeometry = new THREE.CircleGeometry(
    1.42,
    96
  );

  var faceMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b1931,
    metalness: 0.15,
    roughness: 0.65
  });

  var face = new THREE.Mesh(
    faceGeometry,
    faceMaterial
  );

  face.position.z = 0.19;

  compass.add(face);

  /* ---------------------------------------------------------
     NAVIGATION CIRCLE
  --------------------------------------------------------- */

  function makeCircle(radius, color, opacity) {

    var points = [];

    for (var i = 0; i <= 128; i++) {

      var a = (i / 128) * Math.PI * 2;

      points.push(
        new THREE.Vector3(
          Math.cos(a) * radius,
          Math.sin(a) * radius,
          0.215
        )
      );
    }

    var geometry = new THREE.BufferGeometry()
      .setFromPoints(points);

    var material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity
    });

    var line = new THREE.Line(
      geometry,
      material
    );

    compass.add(line);

    return line;
  }

  makeCircle(1.08, 0x4c6a9c, 0.65);
  makeCircle(0.72, 0x4c6a9c, 0.4);

  /* ---------------------------------------------------------
     COMPASS CROSS / DEGREE LINES
  --------------------------------------------------------- */

  var tickGroup = new THREE.Group();

  for (var i = 0; i < 32; i++) {

    var angle = (i / 32) * Math.PI * 2;

    var length = i % 4 === 0 ? 0.16 : 0.08;

    var geometry = new THREE.BoxGeometry(
      0.018,
      length,
      0.018
    );

    var material = new THREE.MeshBasicMaterial({
      color: i % 4 === 0
        ? 0xb9d0ea
        : 0x5e78a0,
      transparent: true,
      opacity: i % 4 === 0 ? 0.9 : 0.5
    });

    var tick = new THREE.Mesh(
      geometry,
      material
    );

    tick.position.x =
      Math.sin(angle) * 1.22;

    tick.position.y =
      Math.cos(angle) * 1.22;

    tick.position.z = 0.23;

    tick.rotation.z = -angle;

    tickGroup.add(tick);
  }

  compass.add(tickGroup);

  /* ---------------------------------------------------------
     COMPASS NEEDLE
  --------------------------------------------------------- */

  var needleGroup = new THREE.Group();

  needleGroup.position.z = 0.30;

  compass.add(needleGroup);

  /* NORTH RED TRIANGLE */

  var northShape = new THREE.Shape();

  northShape.moveTo(0, 0.98);
  northShape.lineTo(-0.15, 0.02);
  northShape.lineTo(0.15, 0.02);
  northShape.lineTo(0, 0.98);

  var northGeometry = new THREE.ShapeGeometry(
    northShape
  );

  var northMaterial = new THREE.MeshStandardMaterial({
    color: 0xf06d6d,
    metalness: 0.35,
    roughness: 0.3,
    side: THREE.DoubleSide
  });

  var northNeedle = new THREE.Mesh(
    northGeometry,
    northMaterial
  );

  needleGroup.add(northNeedle);

  /* SOUTH WHITE NEEDLE */

  var southShape = new THREE.Shape();

  southShape.moveTo(0, -0.98);
  southShape.lineTo(-0.15, -0.02);
  southShape.lineTo(0.15, -0.02);
  southShape.lineTo(0, -0.98);

  var southGeometry = new THREE.ShapeGeometry(
    southShape
  );

  var southMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8eef7,
    metalness: 0.35,
    roughness: 0.3,
    side: THREE.DoubleSide
  });

  var southNeedle = new THREE.Mesh(
    southGeometry,
    southMaterial
  );

  needleGroup.add(southNeedle);

  /* ---------------------------------------------------------
     CENTER PIN
  --------------------------------------------------------- */

  var pin = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.11,
      24,
      24
    ),
    new THREE.MeshStandardMaterial({
      color: 0xb9d0ea,
      metalness: 0.9,
      roughness: 0.18
    })
  );

  pin.position.z = 0.08;

  needleGroup.add(pin);

  /* ---------------------------------------------------------
     CARDINAL DIRECTION MARKERS
  --------------------------------------------------------- */

  function createLetter(letter, x, y) {

    var canvas2 = document.createElement('canvas');

    canvas2.width = 128;
    canvas2.height = 128;

    var ctx = canvas2.getContext('2d');

    ctx.clearRect(
      0,
      0,
      128,
      128
    );

    ctx.font =
      'bold 72px Arial';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle =
      letter === 'N'
        ? '#f06d6d'
        : '#dce8f7';

    ctx.fillText(
      letter,
      64,
      64
    );

    var texture =
      new THREE.CanvasTexture(canvas2);

    texture.needsUpdate = true;

    var material =
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });

    var sprite =
      new THREE.Sprite(material);

    sprite.scale.set(
      0.34,
      0.34,
      1
    );

    sprite.position.set(
      x,
      y,
      0.27
    );

    compass.add(sprite);
  }

  createLetter('N', 0, 1.16);
  createLetter('E', 1.16, 0);
  createLetter('S', 0, -1.16);
  createLetter('W', -1.16, 0);

  /* ---------------------------------------------------------
     CENTRAL GLOW
  --------------------------------------------------------- */

  var glowMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x8fb4e6,
      transparent: true,
      opacity: 0.10
    });

  var glow = new THREE.Mesh(
    new THREE.CircleGeometry(
      1.52,
      64
    ),
    glowMaterial
  );

  glow.position.z = -0.02;

  compass.add(glow);

  /* ---------------------------------------------------------
     FLOATING PARTICLES
  --------------------------------------------------------- */

  var particleCount = 260;

  var particlePositions =
    new Float32Array(
      particleCount * 3
    );

  for (var p = 0; p < particleCount; p++) {

    var radius =
      2.3 + Math.random() * 2.0;

    var angle =
      Math.random() * Math.PI * 2;

    var height =
      (Math.random() - 0.5) * 2.8;

    particlePositions[p * 3] =
      Math.cos(angle) * radius;

    particlePositions[p * 3 + 1] =
      height;

    particlePositions[p * 3 + 2] =
      Math.sin(angle) * radius;
  }

  var particleGeometry =
    new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      particlePositions,
      3
    )
  );

  var particleMaterial =
    new THREE.PointsMaterial({
      color: 0xb9d0ea,
      size: 0.025,
      transparent: true,
      opacity: 0.65
    });

  var particles =
    new THREE.Points(
      particleGeometry,
      particleMaterial
    );

  scene.add(particles);

  /* ---------------------------------------------------------
     CURSOR INTERACTION
  --------------------------------------------------------- */

  var targetX = 0;
  var targetY = 0;

  var currentX = 0;
  var currentY = 0;

  window.addEventListener(
    'mousemove',
    function (e) {

      targetY =
        (e.clientX / innerWidth - 0.5) * 0.35;

      targetX =
        (e.clientY / innerHeight - 0.5) * 0.25;

    },
    { passive: true }
  );

  /* ---------------------------------------------------------
     ANIMATION
  --------------------------------------------------------- */

  var clock =
    new THREE.Clock();

  var alive = true;

  window.__killGlobe =
    function () {
      alive = false;
    };

  /* ---------------------------------------------------------
     RESIZE
  --------------------------------------------------------- */

  function resize() {

    renderer.setSize(
      innerWidth,
      innerHeight,
      false
    );

    camera.aspect =
      innerWidth / innerHeight;

    camera.updateProjectionMatrix();
  }

  addEventListener(
    'resize',
    resize,
    { passive: true }
  );

  /* ---------------------------------------------------------
     MAIN LOOP
  --------------------------------------------------------- */

  (function loop() {

    if (!alive) return;

    if (
      loader.style.display === 'none'
    ) {
      alive = false;
      return;
    }

    requestAnimationFrame(loop);

    var t =
      clock.getElapsedTime();

    /* Smooth cursor movement */

    currentX +=
      (targetX - currentX) * 0.04;

    currentY +=
      (targetY - currentY) * 0.04;

    /* Compass floating */

    compass.position.y =
      Math.sin(t * 0.8) * 0.08;

    compass.position.x =
      Math.sin(t * 0.45) * 0.025;

    /* Main 3D rotation */

    compass.rotation.y =
      Math.sin(t * 0.35) * 0.18 +
      currentY;

    compass.rotation.x =
      0.18 +
      Math.sin(t * 0.5) * 0.035 +
      currentX;

    compass.rotation.z =
      -0.12 +
      Math.sin(t * 0.3) * 0.025;

    /* Needle slowly rotates */

    needleGroup.rotation.z =
      -t * 0.22;

    /* Inner ring rotation */

    innerRing.rotation.z =
      t * 0.12;

    tickGroup.rotation.z =
      -t * 0.035;

    /* Particles */

    particles.rotation.y =
      t * 0.035;

    particles.rotation.x =
      Math.sin(t * 0.15) * 0.05;

    /* Glow breathing */

    glow.material.opacity =
      0.08 +
      Math.sin(t * 2.2) * 0.025;

    /* Center pin pulse */

    var pulse =
      1 +
      Math.sin(t * 3) * 0.12;

    pin.scale.setScalar(pulse);

    renderer.render(
      scene,
      camera
    );

  })();
}

/* =========================================================
   START
========================================================= */

if (
  document.readyState === 'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    startGlobe
  );

} else {

  startGlobe();

}