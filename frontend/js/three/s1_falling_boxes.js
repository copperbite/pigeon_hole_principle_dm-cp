// ============================================================================
// Three.js Scene S1: Falling Pigeons into 3D Boxes
// Physics-style gravity, rising column indicators, collision glow, OrbitControls
// ============================================================================

export class SceneS1 {
  constructor(container, options = {}) {
    this.container = container;
    this.objectsCount = options.objects || 8;
    this.boxesCount = options.boxes || 5;
    this.assignments = options.assignments || [];
    this.isDisposed = false;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 420;

    // Detect theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? 0x090d16 : 0xf8fafc;

    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bgColor);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 14, 18);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // 2. OrbitControls
    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // 4. Floor Plane
    const floorGeo = new THREE.PlaneGeometry(30, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 5. Build Boxes Grid
    this.boxesMeshes = [];
    this.boxOccupantsCount = new Array(this.boxesCount).fill(0);
    this.barsMeshes = [];

    const spacing = 3.2;
    const startX = -((this.boxesCount - 1) * spacing) / 2;

    for (let i = 0; i < this.boxesCount; ++i) {
      const boxGroup = new THREE.Group();
      boxGroup.position.set(startX + i * spacing, 0, 0);

      // Open-top box representation: base + 4 thin walls
      const baseGeo = new THREE.BoxGeometry(2.4, 0.2, 2.4);
      const baseMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x1e293b : 0xffffff,
        roughness: 0.4
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.1;
      base.castShadow = true;
      base.receiveShadow = true;
      boxGroup.add(base);

      // Rising Count Indicator Bar inside box
      const barGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
      const barMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.3
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(0, 0.5, 0);
      bar.scale.set(1, 0.01, 1);
      boxGroup.add(bar);
      this.barsMeshes.push(bar);

      this.scene.add(boxGroup);
      this.boxesMeshes.push({ group: boxGroup, baseMat, base });
    }

    // 6. Falling Pigeons Physics State
    this.pigeons = [];
    const pigeonGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const pigeonMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.2,
      metalness: 0.3
    });

    for (let i = 0; i < this.objectsCount; ++i) {
      const targetBoxIdx = this.assignments[i] !== undefined ? this.assignments[i] : (i % this.boxesCount);
      const targetBoxX = startX + targetBoxIdx * spacing;

      const pMesh = new THREE.Mesh(pigeonGeo, pigeonMat.clone());
      pMesh.castShadow = true;

      // Start above box with a staggered drop delay
      const initialY = 12 + i * 1.4;
      pMesh.position.set(targetBoxX + (Math.random() - 0.5) * 0.6, initialY, (Math.random() - 0.5) * 0.6);

      this.scene.add(pMesh);

      this.pigeons.push({
        mesh: pMesh,
        targetBoxIdx,
        targetBoxX,
        velocityY: 0,
        hasLanded: false,
        dropDelay: i * 12 // frames
      });
    }

    this.frameCount = 0;
    this.animate();
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    this.frameCount++;

    // Update Physics for Pigeons
    const gravity = -0.015;
    const bounceDamping = -0.3;

    this.pigeons.forEach((p, idx) => {
      if (this.frameCount < p.dropDelay) return;

      if (!p.hasLanded) {
        p.velocityY += gravity;
        p.mesh.position.y += p.velocityY;

        // Ground/landing threshold
        const landThreshold = 0.5 + (this.boxOccupantsCount[p.targetBoxIdx] * 0.35);
        if (p.mesh.position.y <= landThreshold) {
          p.mesh.position.y = landThreshold;
          p.velocityY *= bounceDamping;

          if (Math.abs(p.velocityY) < 0.02) {
            p.hasLanded = true;
            this.boxOccupantsCount[p.targetBoxIdx]++;

            // Update box bar height
            const count = this.boxOccupantsCount[p.targetBoxIdx];
            const bar = this.barsMeshes[p.targetBoxIdx];
            bar.scale.y = count * 0.8;
            bar.position.y = (count * 0.8) / 2 + 0.1;

            // Highlight collision if count > 1
            if (count > 1) {
              const boxData = this.boxesMeshes[p.targetBoxIdx];
              boxData.baseMat.color.setHex(0xf97316); // Warm orange collision
              boxData.group.position.y = 0.2; // Slight lift
              p.mesh.material.color.setHex(0xf97316);
            }
          }
        }
      }
    });

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera() {
    this.camera.position.set(0, 14, 18);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) this.controls.target.set(0, 0, 0);
  }

  unmount() {
    this.isDisposed = true;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    // Dispose meshes, geometries, and materials
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
