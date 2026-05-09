document.addEventListener('DOMContentLoaded', () => {
  const grid        = document.getElementById('lineupsGrid');
  const emptyState  = document.getElementById('lineupsEmpty');
  const countEl     = document.getElementById('lineupCount');
  const mapFilter   = document.getElementById('mapFilter');
  const agentFilter = document.getElementById('agentFilter');
  const sideFilter  = document.getElementById('sideFilter');
  const searchInput = document.getElementById('lineupSearch');
  const clearBtn    = document.getElementById('clearFilters');
  const modal       = document.getElementById('lineupModal');
  const backdrop    = document.getElementById('modalBackdrop');
  const modalClose  = document.getElementById('modalClose');

  let allLineups = [];

  // ── Fetch data ──────────────────────────────────────────────────────────────
  fetch(`${CONFIG.API_BASE_URL}/api/lineups`)
    .then(r => r.json())
    .then(data => {
      allLineups = data.lineups || [];
      renderLineups(allLineups);
    })
    .catch(() => {
      countEl.textContent = 'Failed to load lineups — is the backend running?';
    });

  // ── Render ──────────────────────────────────────────────────────────────────
  function renderLineups(lineups) {
    grid.innerHTML = '';
    countEl.textContent = `${lineups.length} lineup${lineups.length !== 1 ? 's' : ''} found`;

    if (lineups.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    lineups.forEach(lineup => {
      const card = document.createElement('article');
      card.className = 'lineup-card';
      card.dataset.id = lineup.id;

      const sideClass  = `side-${lineup.side}`;
      const diffClass  = `diff-${lineup.difficulty.toLowerCase()}`;

      card.innerHTML = `
        <div class="card-header">
          <span class="badge badge-map">${lineup.map}</span>
          <span class="badge badge-side ${sideClass}">${lineup.side.toUpperCase()}</span>
        </div>
        <div class="card-body">
          <div class="card-agent">
            <img src="https://valorant-api.com/v1/agents/search?name=${encodeURIComponent(lineup.agent)}"
                 alt="${lineup.agent}" class="card-agent-icon" loading="lazy"
                 onerror="this.style.display='none'">
            <span class="card-agent-name">${lineup.agent}</span>
          </div>
          <h3 class="card-title">${lineup.title}</h3>
          <p class="card-position"><i class="fas fa-map-marker-alt"></i> ${lineup.position}</p>
        </div>
        <div class="card-footer">
          <span class="badge badge-diff ${diffClass}">${lineup.difficulty}</span>
          <button class="view-btn" aria-label="View lineup ${lineup.title}">VIEW</button>
        </div>`;

      card.querySelector('.view-btn').addEventListener('click', () => openModal(lineup));
      card.addEventListener('click', e => {
        if (!e.target.closest('.view-btn')) openModal(lineup);
      });

      grid.appendChild(card);
    });

    ScrollReveal && ScrollReveal({ distance: '30px', duration: 600, interval: 80 }).reveal('.lineup-card');
  }

  // ── Filter ──────────────────────────────────────────────────────────────────
  function applyFilters() {
    const map    = mapFilter.value;
    const agent  = agentFilter.value;
    const side   = sideFilter.value;
    const search = searchInput.value.toLowerCase().trim();

    const filtered = allLineups.filter(l => {
      if (map   !== 'all' && l.map.toLowerCase()   !== map.toLowerCase())   return false;
      if (agent !== 'all' && l.agent.toLowerCase() !== agent.toLowerCase()) return false;
      if (side  !== 'all' && l.side !== side && l.side !== 'both')          return false;
      if (search && !l.title.toLowerCase().includes(search)
                 && !l.description.toLowerCase().includes(search)
                 && !l.map.toLowerCase().includes(search)
                 && !l.agent.toLowerCase().includes(search))                return false;
      return true;
    });

    renderLineups(filtered);
  }

  mapFilter.addEventListener('change', applyFilters);
  agentFilter.addEventListener('change', applyFilters);
  sideFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);

  clearBtn.addEventListener('click', () => {
    mapFilter.value   = 'all';
    agentFilter.value = 'all';
    sideFilter.value  = 'all';
    searchInput.value = '';
    renderLineups(allLineups);
  });

  // ── Modal ───────────────────────────────────────────────────────────────────
  function openModal(lineup) {
    document.getElementById('modalMap').textContent   = lineup.map;
    document.getElementById('modalAgent').textContent = lineup.agent;
    document.getElementById('modalSide').textContent  = lineup.side.toUpperCase();
    document.getElementById('modalDiff').textContent  = lineup.difficulty;
    document.getElementById('modalTitle').textContent    = lineup.title;
    document.getElementById('modalPosition').textContent = `Position: ${lineup.position}`;
    document.getElementById('modalDesc').textContent     = lineup.description;

    const iframe = document.getElementById('modalVideo');
    iframe.src = lineup.videoUrl || '';

    const tagsEl = document.getElementById('modalTags');
    tagsEl.innerHTML = (lineup.tags || []).map(t => `<span class="tag">#${t}</span>`).join('');

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.getElementById('modalVideo').src = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
