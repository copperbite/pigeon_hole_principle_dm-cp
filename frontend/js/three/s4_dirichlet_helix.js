// ============================================================================
// Three.js Scene S4: Dirichlet on Helix / Cylinder
// Wrapping sequence {q * alpha} onto a 3D helix to visualize fractional clustering
// ============================================================================

export class SceneS4 {
  constructor(container, options = {}) {
    this.container = container;
    this.alpha = options.alpha || 3.141592653589793;
    this.N = options.N || 15;
    this.q1 = options.q1 || 0;
    this.q2 = options.q2 || 1;
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
    this.camera.position.set(0, 8, 16);

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
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    // Central Reference Cylinder (Wireframe guide)
    const cylRadius = 4;
    const cylHeight = 12;
    const cylGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 32, 1, true);
    const cylMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x334155 : 0xcbd5e1,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const cylinder = new THREE.Mesh(cylGeo, cylMat);
    this.scene.add(cylinder);

    // Helix Curve and Nodes
    const curvePoints = [];
    const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);

    for (let q = 0; q <= this.N; ++q) {
      const frac = (q * this.alpha) % 1.0;
      const angle = frac * Math.PI * 2;
      const y = -cylHeight / 2 + (q / this.N) * cylHeight;
      const x = cylRadius * Math.cos(angle);
      const z = cylRadius * Math.sin(angle);

      curvePoints.push(new THREE.Vector3(x, y, z));

      const isCollision = (q === this.q1 || q === this.q2);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isCollision ? 0xf97316 : 0x3b82f6,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(sphereGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      this.scene.add(nodeMesh);
    }

    // Connect Helix with Line
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.6
    });
    const line = new THREE.Line(lineGeo, lineMat);
    this.scene.add(line);

    this.animate();
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(0, 8, 16);
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
