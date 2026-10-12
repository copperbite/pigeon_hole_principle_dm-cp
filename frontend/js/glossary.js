// ============================================================================
// Pigeonhole Lab - Central Glossary & Tooltip System
// ============================================================================

export const glossary = {
  pigeonhole: "A discrete slot, bucket, or partition that receives elements under a mapping.",
  pigeon: "An item, object, or mathematical entity being assigned into a pigeonhole.",
  ceiling: "The smallest integer greater than or equal to a real number, denoted ⌈x⌉.",
  residue: "The remainder left over after dividing one integer by another (a mod n).",
  collision: "An event where two or more distinct inputs are mapped to the exact same pigeonhole.",
  monochromatic: "A graph structure (e.g. triangle) where all edges share the exact same color.",
  load_factor: "The ratio of stored elements to total available buckets in a hash table (α = n / k).",
  adversarial: "A worst-case strategy that intentionally distributes objects to avoid or delay collisions.",
  injective: "A one-to-one function where distinct elements in the domain map to distinct elements in the codomain.",
  prefix_sum: "The cumulative sum of a sequence up to a given index (S_i = a_1 + ... + a_i).",
  bipartite: "A graph whose vertices can be divided into two disjoint sets such that every edge connects the two sets.",
  chromatic_number: "The minimum number of colors required to color the vertices of a graph such that no adjacent vertices share a color."
};

export function wrapGlossaryTerms(text) {
  let enriched = text;
  for (const [key, definition] of Object.entries(glossary)) {
    const readable = key.replace('_', ' ');
    const regex = new RegExp(`\\b(${readable})\\b`, 'gi');
    enriched = enriched.replace(regex, (match) => {
      return `<span class="glossary-term" tabindex="0">${match}<span class="tooltip-popup">${definition}</span></span>`;
    });
  }
  return enriched;
}
