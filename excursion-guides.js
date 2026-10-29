// Read-only authored plans, scoped to the exact destination and visit date.
(() => {
  'use strict';
  const language = () => { try { return localStorage.getItem('journey-tracker-language') === 'en' ? 'en' : 'fr'; } catch { return 'fr'; } };
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el; };
  const panels = [];
  for (const plan of window.JOURNEY_EXCURSION_GUIDES || []) {
    const guide = document.getElementById('guide' + plan.portIndex);
    if (!guide || typeof days === 'undefined' || !days.some(d => d[0] === plan.date && d[1] === plan.destination)) continue;
    const panel = node('section', '', 'excursion-guide');
    panel.id = plan.id;
    panel.dataset.ownTranslation = 'true';
    panel.dataset.status = plan.status;
    guide.prepend(panel);
    panels.push({plan, panel});
  }
  function render() {
    for (const {plan, panel} of panels) {
      const q = plan[language()], wasOpen = panel.querySelector('details')?.open;
      const title = node('h4', q.title), date = node('p', q.date + ' · ' + q.status);
      const safety = node('aside', '', 'excursion-return');
      safety.append(node('strong', q.target), node('p', q.deadline), node('p', q.clock));
      const details = node('details', '', 'disclosure');
      const summary = node('summary', language() === 'fr' ? 'Les 4 étapes de la sortie' : 'The 4 excursion steps');
      details.open = wasOpen === undefined ? true : wasOpen;
      const list = node('ol');
      for (const step of q.steps) {
        const item = node('li'); item.append(node('h5', step.title), node('p', step.body));
        if (step.detail) item.append(node('p', step.detail));
        list.append(item);
      }
      const links = node('div', '', 'excursion-links');
      const sources = node('div', '', 'excursion-links');
      for (const [key, parent] of [['map', links], ['walk', links], ['park', sources], ['port', sources]]) {
        const link = node('a', q[key]); link.href = plan.links[key]; link.target = '_blank'; link.rel = 'noopener noreferrer'; parent.append(link);
      }
      details.append(summary, list, node('small', q.sources), sources);
      panel.replaceChildren(title, date, safety, links, details);
    }
  }
  function revealHash() {
    const entry = panels.find(({panel}) => '#' + panel.id === location.hash);
    if (!entry) return;
    document.getElementById('destinationsDetails').open = true;
    const guide = entry.panel.parentElement;
    if (guide.hidden) guide.previousElementSibling.click();
    entry.panel.scrollIntoView({block: 'start'});
  }
  render();
  document.addEventListener('click', event => { if (event.target.closest('#languageSwitch')) setTimeout(render, 0); });
  window.addEventListener('hashchange', revealHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revealHash); else revealHash();
})();
