// ============================================================================
// UI Component: Stepper (Step-by-step interactive proof reveal)
// ============================================================================

export class Stepper {
  constructor(container, steps = [], onStepChange = null) {
    this.container = container;
    this.steps = steps;
    this.currentStep = 0;
    this.onStepChange = onStepChange;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="proof-stepper-wrap">
        <div class="stepper-steps">
          ${this.steps.map((step, idx) => `
            <div class="step-card ${idx === 0 ? 'active revealed' : 'hidden'}" id="step-${idx}">
              <div class="step-number">Step ${idx + 1} of ${this.steps.length}: ${step.title}</div>
              <div class="step-content">${step.content}</div>
            </div>
          `).join('')}
        </div>
        <div class="stepper-controls">
          <button class="btn btn-outline" id="prevStepBtn" ${this.currentStep === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn btn-primary" id="nextStepBtn">${this.currentStep === this.steps.length - 1 ? 'Reset Proof' : 'Next Step →'}</button>
          <span class="stepper-progress-text" style="margin-left:auto; align-self:center; font-size:0.8125rem; color:var(--text-muted)">
            Step <b id="stepCounter">${this.currentStep + 1}</b> / ${this.steps.length}
          </span>
        </div>
      </div>
    `;

    this.container.querySelector('#prevStepBtn').addEventListener('click', () => this.prev());
    this.container.querySelector('#nextStepBtn').addEventListener('click', () => this.next());
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.update();
    }
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.currentStep = 0; // Loop or reset
    }
    this.update();
  }

  update() {
    this.steps.forEach((_, idx) => {
      const el = this.container.querySelector(`#step-${idx}`);
      if (!el) return;
      if (idx <= this.currentStep) {
        el.className = `step-card revealed ${idx === this.currentStep ? 'active' : ''}`;
      } else {
        el.className = 'step-card hidden';
      }
    });

    const prevBtn = this.container.querySelector('#prevStepBtn');
    const nextBtn = this.container.querySelector('#nextStepBtn');
    const counter = this.container.querySelector('#stepCounter');

    if (prevBtn) prevBtn.disabled = this.currentStep === 0;
    if (nextBtn) nextBtn.textContent = this.currentStep === this.steps.length - 1 ? '↺ Start Over' : 'Next Step →';
    if (counter) counter.textContent = this.currentStep + 1;

    if (this.onStepChange) {
      this.onStepChange(this.currentStep);
    }
  }
}
