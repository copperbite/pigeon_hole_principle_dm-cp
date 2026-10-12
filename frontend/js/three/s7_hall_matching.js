// ============================================================================
// Three.js Scene S7: Hall's Bipartite Matching in 3D
// Two parallel planes of vertices with edges, highlighting matches and violator sets
// ============================================================================

export class SceneS7 {
  constructor(container, options = {}) {
    this.container = container;
    this.boysCount = options.boys || 5;
    this.girlsCount = options.girls || 5;
    this.edges = options.edges || [
      [0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 3], [4, 3], [4, 4]
    ];
    this.matching = options.matching || [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
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
    this.camera.position.set(0, 12, 18);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    this.graphGroup = new THREE.Group();
    this.scene.add(this.graphGroup);

    this.buildGraph();
    this.animate();
  }

  buildGraph() {
    while (this.graphGroup.children.length > 0) {
      const obj = this.graphGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.graphGroup.remove(obj);
    }

    const leftZ = -4;
    const rightZ = 4;
    const sphereGeo = new THREE.SphereGeometry(0.5, 24, 24);
    const leftMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 }); // Blue
    const rightMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 }); // Pink

    const leftPositions = [];
    const rightPositions = [];

    const spacingLeft = 12 / Math.max(1, this.boysCount - 1);
    for (let i = 0; i < this.boysCount; i++) {
      const x = -6 + i * spacingLeft;
      const pos = new THREE.Vector3(x, 0, leftZ);
      leftPositions.push(pos);

      const mesh = new THREE.Mesh(sphereGeo, leftMat);
      mesh.position.copy(pos);
      this.graphGroup.add(mesh);
    }

    const spacingRight = 12 / Math.max(1, this.girlsCount - 1);
    for (let j = 0; j < this.girlsCount; j++) {
      const x = -6 + j * spacingRight;
      const pos = new THREE.Vector3(x, 0, rightZ);
      rightPositions.push(pos);

      const mesh = new THREE.Mesh(sphereGeo, rightMat);
      mesh.position.copy(pos);
      this.graphGroup.add(mesh);
    }

    // Match set lookup
    const matchLookup = new Set(this.matching.map(m => `${m[0]}-${m[1]}`));

    // Render edges
    this.edges.forEach(([u, v]) => {
      if (u < leftPositions.length && v < rightPositions.length) {
        const isMatched = matchLookup.has(`${u}-${v}`);
        const p1 = leftPositions[u];
        const p2 = rightPositions[v];

        const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineBasicMaterial({
          color: isMatched ? 0x10b981 : 0x64748b, // Emerald green for match, slate for other
          linewidth: isMatched ? 3 : 1,
          opacity: isMatched ? 1.0 : 0.4,
          transparent: true
        });

        const line = new THREE.Line(lineGeo, lineMat);
        this.graphGroup.add(line);
      }
    });
  }

  updateData(boys, girls, edges, matching) {
    this.boysCount = boys;
    this.girlsCount = girls;
    this.edges = edges;
    this.matching = matching;
    this.buildGraph();
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(0, 12, 18);
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
