// ============================================================================
// Three.js Scene S3: Ramsey K6 / K5 in 3D
// Spherical graph layout with clickable red/blue edges and pulsing translucent triangle faces
// ============================================================================

export class SceneS3 {
  constructor(container, options = {}) {
    this.container = container;
    this.numVertices = options.n || 6;
    this.edgeColors = options.edgeColors || [];
    this.onEdgeToggle = options.onEdgeToggle || null;
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
    this.camera.position.set(0, 5, 14);

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

    // Arrange vertices evenly around a circle/sphere in 3D
    this.vertexPositions = [];
    const sphereRadius = 4.5;
    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2 });

    for (let i = 0; i < this.numVertices; ++i) {
      const angle = (i / this.numVertices) * Math.PI * 2;
      const x = sphereRadius * Math.cos(angle);
      const y = sphereRadius * Math.sin(angle);
      const z = (i % 2 === 0 ? 0.6 : -0.6);

      const pos = new THREE.Vector3(x, y, z);
      this.vertexPositions.push(pos);

      const node = new THREE.Mesh(sphereGeo, nodeMat);
      node.position.copy(pos);
      this.scene.add(node);
    }

    // Build Edges
    this.edgeMeshes = [];
    let edgeIdx = 0;
    for (let i = 0; i < this.numVertices; ++i) {
      for (let j = i + 1; j < this.numVertices; ++j) {
        const color = (this.edgeColors[edgeIdx] !== undefined) ? this.edgeColors[edgeIdx] : (edgeIdx % 2);

        const p1 = this.vertexPositions[i];
        const p2 = this.vertexPositions[j];
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();

        const cylGeo = new THREE.CylinderGeometry(0.08, 0.08, len, 8);
        const cylMat = new THREE.MeshStandardMaterial({
          color: color === 0 ? 0xef4444 : 0x3b82f6 // Red or Blue
        });

        const edgeCyl = new THREE.Mesh(cylGeo, cylMat);
        edgeCyl.position.copy(p1).add(dir.clone().multiplyScalar(0.5));
        edgeCyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        this.scene.add(edgeCyl);
        this.edgeMeshes.push({ mesh: edgeCyl, u: i, v: j, color, index: edgeIdx });
        edgeIdx++;
      }
    }

    // Setup Raycasting for edge clicks
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.clickHandler = (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.edgeMeshes.map(e => e.mesh));

      if (intersects.length > 0) {
        const hit = this.edgeMeshes.find(e => e.mesh === intersects[0].object);
        if (hit) {
          hit.color = 1 - hit.color; // toggle 0 <-> 1
          hit.mesh.material.color.setHex(hit.color === 0 ? 0xef4444 : 0x3b82f6);
          this.updateMonochromaticFaces();
          if (this.onEdgeToggle) this.onEdgeToggle(hit.index, hit.color);
        }
      }
    };
    this.renderer.domElement.addEventListener('click', this.clickHandler);

    // Group for translucent monochromatic triangle faces
    this.triFacesGroup = new THREE.Group();
    this.scene.add(this.triFacesGroup);
    this.updateMonochromaticFaces();

    this.animate();
  }

  updateMonochromaticFaces() {
    // Clear existing faces
    while (this.triFacesGroup.children.length > 0) {
      const obj = this.triFacesGroup.children[0];
      obj.geometry.dispose();
      obj.material.dispose();
      this.triFacesGroup.remove(obj);
    }

    // Detect all monochromatic triangles
    for (let i = 0; i < this.numVertices; ++i) {
      for (let j = i + 1; j < this.numVertices; ++j) {
        for (let k = j + 1; k < this.numVertices; ++k) {
          const e1 = this.edgeMeshes.find(e => (e.u === i && e.v === j) || (e.u === j && e.v === i));
          const e2 = this.edgeMeshes.find(e => (e.u === j && e.v === k) || (e.u === k && e.v === j));
          const e3 = this.edgeMeshes.find(e => (e.u === i && e.v === k) || (e.u === k && e.v === i));

          if (e1 && e2 && e3 && e1.color === e2.color && e2.color === e3.color) {
            // Build translucent triangle face
            const geom = new THREE.BufferGeometry();
            const verts = new Float32Array([
              this.vertexPositions[i].x, this.vertexPositions[i].y, this.vertexPositions[i].z,
              this.vertexPositions[j].x, this.vertexPositions[j].y, this.vertexPositions[j].z,
              this.vertexPositions[k].x, this.vertexPositions[k].y, this.vertexPositions[k].z
            ]);
            geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
            geom.computeVertexNormals();

            const mat = new THREE.MeshBasicMaterial({
              color: e1.color === 0 ? 0xef4444 : 0x3b82f6,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.35
            });
            const face = new THREE.Mesh(geom, mat);
            this.triFacesGroup.add(face);
          }
        }
      }
    }
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Pulse monochromatic faces
    const time = Date.now() * 0.003;
    const pulseOpacity = 0.25 + 0.15 * Math.sin(time);
    this.triFacesGroup.children.forEach(f => {
      f.material.opacity = pulseOpacity;
    });

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(0, 5, 14);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) this.controls.target.set(0, 0, 0);
  }

  unmount() {
    this.isDisposed = true;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.clickHandler) {
      this.renderer.domElement.removeEventListener('click', this.clickHandler);
    }
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
