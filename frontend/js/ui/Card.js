// ============================================================================
// UI Component: Card
// ============================================================================

export function Card({ title = '', badge = '', content = '', footer = '' }) {
  return `
    <article class="card">
      ${title || badge ? `
        <div class="card-header">
          ${title ? `<h3 class="card-title">${title}</h3>` : ''}
          ${badge ? `<span class="badge">${badge}</span>` : ''}
        </div>
      ` : ''}
      <div class="card-content">
        ${content}
      </div>
      ${footer ? `
        <div class="card-footer">
          ${footer}
        </div>
      ` : ''}
    </article>
  `;
}
