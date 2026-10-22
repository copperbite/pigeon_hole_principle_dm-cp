// ============================================================================
// Pigeonhole Lab - App Orchestrator, Router & API Client
// ============================================================================

import HomeModule from './modules/home.js';

class App {
  constructor() {
    this.apiBase = 'http://localhost:8080/api';
    this.isBackendOnline = false;
    this.currentModule = null;
    this.modulesRegistry = {};

    this.initTheme();
    this.registerModules();
    this.initEventListeners();
    this.checkBackendHealth();
    this.initRouter();
  }

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem('phl_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.applyTheme(theme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('phl_theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // --- Module Registry ---
  registerModules() {
    this.modulesRegistry['home'] = HomeModule;
  }

  registerModule(id, moduleDef) {
    this.modulesRegistry[id] = moduleDef;
  }

  // --- Backend Health & API Client ---
  async checkBackendHealth() {
    const dot = document.getElementById('backendDot');
    const text = document.getElementById('backendText');
    const banner = document.getElementById('offlineBanner');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.apiBase}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isBackendOnline = data.ok === true;
      } else {
        this.isBackendOnline = false;
      }
    } catch {
      this.isBackendOnline = false;
    }

    if (this.isBackendOnline) {
      if (dot) dot.className = 'status-dot online';
      if (text) text.textContent = 'Backend C++ Online';
      if (banner) banner.classList.remove('visible');
    } else {
      if (dot) dot.className = 'status-dot';
      if (text) text.textContent = 'Backend Offline';
      if (banner) banner.classList.add('visible');
    }
  }

  async fetchApi(endpoint, params = {}, options = {}) {
    const url = new URL(`${this.apiBase}${endpoint}`);
    Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));

    try {
      const res = await fetch(url.toString(), { credentials: 'omit', ...options });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`API call failed for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- Router ---
  initRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const container = document.getElementById('contentContainer');
    if (!container) return;

    let moduleId = 'home';
    if (hash.startsWith('/module/')) {
      moduleId = hash.replace('/module/', '').trim();
    }

    const REDIRECT_MAP = {
      'b1_erdos_szekeres': 'b7_handshake',
      'b8_compression': 'r1_real_world',
      'c2_hall_marriage': 'c1_havel_hakimi',
      'b2_dirichlet': 'b3_divisible',
      'a3_exhaustive': 'a2_generalized',
      'a6_averaging': 'a2_generalized',
      'a8_higher_structure': 'home',
      'a6': 'home',
      'b6_ramsey': 'b7_handshake',
      'b9_pigeon_sort': 'home',
      'c3_graph_coloring': 'c1_havel_hakimi',
      'c4_mantel': 'c1_havel_hakimi',
      'g1_points_square': 'home',
      'g2_happy_ending': 'home',
      'g3_number_theory': 'home'
    };

    if (REDIRECT_MAP[moduleId]) {
      window.location.hash = `#/module/${REDIRECT_MAP[moduleId]}`;
      return;
    }

    // Update sidebar active link
    document.querySelectorAll('.nav-item').forEach(item => {
      const target = item.getAttribute('data-nav');
      item.classList.toggle('active', target === moduleId);
    });

    // Cleanup previous module
    if (this.currentModule && typeof this.currentModule.unmount === 'function') {
      try { this.currentModule.unmount(); } catch (e) { console.error('Error during unmount:', e); }
    }

    // Lazy load module if not yet loaded in registry
    let module = this.modulesRegistry[moduleId];
    if (!module && moduleId !== 'home') {
      try {
        const imported = await import(`./modules/${moduleId}.js?v=3`);
        module = imported.default || imported;
        this.modulesRegistry[moduleId] = module;
      } catch (err) {
        console.warn(`Module ${moduleId} not found or still in development:`, err);
        container.innerHTML = `
          <div class="card" style="text-align:center; padding:var(--space-10)">
            <div style="font-size:2.5rem; margin-bottom:var(--space-3)">🚧</div>
            <h2>Module "${moduleId}" In Progress</h2>
            <p style="color:var(--text-muted); margin:var(--space-3) 0">This module is scheduled in the upcoming build phase.</p>
            <a href="#/" class="btn btn-primary">Return to Home</a>
          </div>
        `;
        return;
      }
    }

    if (!module) module = HomeModule;
    this.currentModule = module;

    // Mount module
    try {
      await module.mount(container, {
        fetch: (ep, p, opts) => this.fetchApi(ep, p, opts),
        isOnline: () => this.isBackendOnline
      });
      this.typesetMath(container);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error mounting module:', err);
      container.innerHTML = `<div class="callout callout-warning"><strong>Failed to mount module:</strong> ${err.message}</div>`;
    }
  }

  typesetMath(element) {
    if (window.renderMathInElement) {
      window.renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // --- Global Event Listeners ---
  initEventListeners() {
    // Mobile sidebar toggle
    const toggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Close mobile nav on item click
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (sidebar && window.innerWidth <= 900) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Global Search
    const search = document.getElementById('globalSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.nav-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          const matches = !query || text.includes(query);
          item.style.display = matches ? 'flex' : 'none';
        });
      });
    }
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.phlApp = new App();
});
