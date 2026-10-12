// ============================================================================
// Three.js Scene S6: Hash Load Landscape
// 3D bar chart terrain comparing uniform distribution vs pathological clustering
// ============================================================================

export class SceneS6 {
  constructor(container, options = {}) {
    this.container = container;
    this.buckets = options.buckets || 16;
    this.keys = options.keys || 64;
    this.mode = options.mode || 'modulo'; // 'modulo' or 'knuth'
    this.isDisposed = false;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 420;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? 0x090d16 : 0xf8fafc;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bgColor);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(14, 16, 20);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(24, 24, isDark ? 0x334155 : 0xcbd5e1, isDark ? 0x1e293b : 0xe2e8f0);
    this.scene.add(gridHelper);

    this.barsGroup = new THREE.Group();
    this.scene.add(this.barsGroup);

    this.buildTerrain();
    this.animate();
  }

  buildTerrain() {
    // Clear existing bars
    while (this.barsGroup.children.length > 0) {
      const obj = this.barsGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.barsGroup.remove(obj);
    }

    // Grid size: 4x4 for 16 buckets or NxN
    const cols = Math.ceil(Math.sqrt(this.buckets));
    const rows = Math.ceil(this.buckets / cols);
    const counts = new Array(this.buckets).fill(0);

    for (let i = 0; i < this.keys; i++) {
      let bucket;
      if (this.mode === 'modulo') {
        // Pathological modulo clustering: multiples of 4 or 8
        const key = (i * 4) + (i % 2 === 0 ? 0 : 1);
        bucket = key % this.buckets;
      } else {
        // Uniform / Knuth multiplicative hash
        const A = 0.6180339887; // golden ratio fractional part
        const frac = (i * A) % 1;
        bucket = Math.floor(this.buckets * frac);
      }
      counts[bucket] = (counts[bucket] || 0) + 1;
    }

    const avg = this.keys / this.buckets;
    const spacing = 2.2;
    const offsetX = -((cols - 1) * spacing) / 2;
    const offsetZ = -((rows - 1) * spacing) / 2;

    for (let b = 0; b < this.buckets; b++) {
      const r = Math.floor(b / cols);
      const c = b % cols;
      const count = counts[b];
      const h = Math.max(0.2, count * 0.8);

      const geo = new THREE.BoxGeometry(1.6, h, 1.6);
      
      // Color: Green if balanced, Orange if heavy collision
      let col = 0x3b82f6; // blue default
      if (count > avg * 1.5) col = 0xef4444; // spiky/red
      else if (count === 0) col = 0x64748b; // empty/slate
      else if (count <= avg) col = 0x10b981; // green

      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.3,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(offsetX + c * spacing, h / 2, offsetZ + r * spacing);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.barsGroup.add(mesh);
    }
  }

  setMode(mode) {
    this.mode = mode;
    this.buildTerrain();
  }

  setKeysAndBuckets(keys, buckets) {
    this.keys = keys;
    this.buckets = buckets;
    this.buildTerrain();
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(14, 16, 20);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) this.controls.target.set(0, 0, 0);
  }

  unmount() {
    this.isDisposed = true;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
