// ============================================================================
// Three.js Scene S2: Erdős-Szekeres in 3D
// Points at (i, L_i, D_i) inside an m x n slab with a glowing monotone trajectory
// ============================================================================

export class SceneS2 {
  constructor(container, options = {}) {
    this.container = container;
    this.m = options.m || 3;
    this.n = options.n || 3;
    this.pairs = options.pairs || [];
    this.incIndices = options.incIndices || [];
    this.decIndices = options.decIndices || [];
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
    this.camera.position.set(12, 10, 16);

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

    // Bounding slab: X is index (0..N-1), Y is L_i (1..m), Z is D_i (1..n)
    const N = this.pairs.length || (this.m * this.n + 1);
    const slabGeo = new THREE.BoxGeometry(N * 0.8, this.m * 1.5, this.n * 1.5);
    const slabMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x334155 : 0xcbd5e1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.set(0, (this.m * 1.5) / 2, (this.n * 1.5) / 2);
    this.scene.add(slab);

    // Plot points at (i, L_i, D_i)
    const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const trajectoryPoints = [];

    const isIncLonger = this.incIndices.length >= this.decIndices.length;
    const chosenSubseq = isIncLonger ? this.incIndices : this.decIndices;
    const subseqColor = isIncLonger ? 0x22c55e : 0xf97316; // Green for inc, Orange for dec

    this.pairs.forEach((pt) => {
      const x = -((N - 1) * 0.8) / 2 + pt.index * 0.8;
      const y = pt.L * 1.5;
      const z = pt.D * 1.5;

      const isPart = chosenSubseq.includes(pt.index);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isPart ? subseqColor : 0x3b82f6,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(sphereGeo, nodeMat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);

      if (isPart) {
        trajectoryPoints.push(new THREE.Vector3(x, y, z));
      }
    });

    // Glowing Trajectory Path
    if (trajectoryPoints.length > 1) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: subseqColor,
        linewidth: 3
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.scene.add(line);
    }

    this.animate();
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(12, 10, 16);
    this.camera.lookAt(0, 3, 3);
    if (this.controls) this.controls.target.set(0, 3, 3);
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
