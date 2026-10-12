// ============================================================================
// Three.js Scene S5: Birthday Probability Surface
// 3D Wireframe/Grid Surface of P(n, k) with Moving Coordinate Marker & 50% Contour
// ============================================================================

export class SceneS5 {
  constructor(container, options = {}) {
    this.container = container;
    this.currentN = options.n || 23;
    this.currentK = options.k || 365;
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
    this.camera.position.set(16, 14, 18);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(15, 25, 15);
    this.scene.add(dirLight);

    // Build 3D Probability Surface: n in [1..60], k in [50..400]
    const gridRes = 30;
    const planeGeo = new THREE.PlaneGeometry(16, 16, gridRes, gridRes);
    const pos = planeGeo.attributes.position;

    // Plane is aligned in X-Y initially; rotate to X-Z and lift by Z
    const colors = [];
    for (let i = 0; i < pos.count; ++i) {
      const u = (pos.getX(i) + 8) / 16; // 0..1 (represents n: 1..70)
      const v = (pos.getY(i) + 8) / 16; // 0..1 (represents k: 50..400)

      const nVal = 1 + u * 69;
      const kVal = 50 + v * 350;

      // Approximate P(n, k) = 1 - exp(-n(n - 1) / (2k))
      const p = Math.max(0, Math.min(1, 1 - Math.exp(-(nVal * (nVal - 1)) / (2 * kVal))));

      // Set elevation in Z
      pos.setZ(i, p * 6);

      // Color vertex based on probability: blue (low) -> orange/green (50%) -> red (high)
      const color = new THREE.Color();
      if (p < 0.5) color.setHSL(0.6 - p * 0.4, 0.8, 0.5);
      else color.setHSL(0.1 - (p - 0.5) * 0.2, 0.9, 0.5);
      colors.push(color.r, color.g, color.b);
    }

    planeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    planeGeo.computeVertexNormals();

    const planeMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.3,
      metalness: 0.1,
      wireframe: false,
      side: THREE.DoubleSide
    });
    const surface = new THREE.Mesh(planeGeo, planeMat);
    surface.rotation.x = -Math.PI / 2;
    this.scene.add(surface);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x334155 : 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wire = new THREE.Mesh(planeGeo, wireMat);
    wire.rotation.x = -Math.PI / 2;
    this.scene.add(wire);

    // Marker for User's Current (n, k)
    const markerGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.1 });
    this.marker = new THREE.Mesh(markerGeo, markerMat);
    this.scene.add(this.marker);
    this.updateMarker(this.currentN, this.currentK);

    this.animate();
  }

  updateMarker(n, k) {
    this.currentN = n;
    this.currentK = k;
    const u = Math.min(1, Math.max(0, (n - 1) / 69));
    const v = Math.min(1, Math.max(0, (k - 50) / 350));

    const x = -8 + u * 16;
    const z = -(-8 + v * 16);
    const p = Math.max(0, Math.min(1, 1 - Math.exp(-(n * (n - 1)) / (2 * k))));
    const y = p * 6;

    if (this.marker) {
      this.marker.position.set(x, y + 0.3, z);
    }
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(16, 14, 18);
    this.camera.lookAt(0, 2, 0);
    if (this.controls) this.controls.target.set(0, 2, 0);
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
