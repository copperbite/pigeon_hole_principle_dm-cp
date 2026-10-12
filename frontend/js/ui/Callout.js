// ============================================================================
// UI Component: Callout (Idea, Warning, Fun fact, Real life)
// ============================================================================

export function Callout({ type = 'idea', title = '', content = '' }) {
  const icons = {
    idea: '💡',
    warning: '⚠️',
    funfact: '✨',
    reallife: '🌍'
  };

  const titles = {
    idea: title || 'Core Insight',
    warning: title || 'Caution / Common Pitfall',
    funfact: title || 'Did You Know?',
    reallife: title || 'Real-World Connection'
  };

  return `
    <div class="callout callout-${type}" role="note">
      <span class="callout-icon">${icons[type] || '📌'}</span>
      <div class="callout-body">
        <strong>${titles[type]}</strong>
        <p>${content}</p>
      </div>
    </div>
  `;
}
