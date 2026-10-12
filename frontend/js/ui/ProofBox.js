// ============================================================================
// UI Component: ProofBox (Formal Step-by-Step Proof Presentation)
// ============================================================================

export function ProofBox({ method = 'Contradiction', statement = '', steps = [] }) {
  return `
    <div class="proof-box">
      <div class="proof-header">
        <div>
          <span class="badge badge-advanced">Proof Technique: ${method}</span>
          <p style="font-size:0.9375rem; color:var(--text-muted); margin-top:6px">
            <strong>Claim:</strong> ${statement}
          </p>
        </div>
      </div>
      <div class="proof-steps" style="display:flex; flex-direction:column; gap:var(--space-3); margin-top:var(--space-4)">
        ${steps.map((s, idx) => `
          <div style="padding:var(--space-3) var(--space-4); background:var(--bg-subtle); border-radius:var(--radius-md); border-left:3px solid var(--primary-500)">
            <strong style="font-size:0.8125rem; color:var(--primary-600)">Step ${idx + 1}: ${s.label}</strong>
            <p style="margin-top:2px; font-size:0.9375rem">${s.text}</p>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:var(--space-4); text-align:right; font-family:serif; font-size:1.125rem; font-weight:700; color:var(--primary-600)">
        ∎ Q.E.D.
      </div>
    </div>
  `;
}
