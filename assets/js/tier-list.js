document.addEventListener('DOMContentLoaded', () => {
  const table    = document.getElementById('tierlistTable');
  const btnPro   = document.getElementById('btnPro');
  const btnRanked= document.getElementById('btnRanked');
  const modeNote = document.getElementById('modeNote');

  const TIER_COLORS = {
    'S+': { bg: '#FFD700', text: '#0f1923' },
    'S':  { bg: '#ff4655', text: '#fff'    },
    'A':  { bg: '#ff8c42', text: '#fff'    },
    'B':  { bg: '#f9c74f', text: '#0f1923' },
    'C':  { bg: '#4cc9f0', text: '#0f1923' },
    'D':  { bg: '#6c757d', text: '#fff'    },
  };

  const MODE_NOTES = {
    pro:    'Based on current VCT meta &amp; pick rates.',
    ranked: 'Based on Immortal+ ranked win-rate data.'
  };

  let tierData    = null;
  let agentIcons  = {};   // agentName -> displayIconSmall URL
  let currentMode = 'pro';

  // ── Load tier data + agent icons in parallel ─────────────────────────────
  Promise.all([
    fetch(`${CONFIG.API_BASE_URL}/api/tierlist`).then(r => r.json()),
    fetch('https://valorant-api.com/v1/agents').then(r => r.json())
  ])
  .then(([tiers, agentsData]) => {
    tierData = tiers;

    agentsData.data.forEach(agent => {
      if (agent.isPlayableCharacter) {
        agentIcons[agent.displayName] = agent.displayIconSmall;
      }
    });

    renderTable('pro');
  })
  .catch(() => {
    table.innerHTML = '<p style="color:#ff4655;padding:2rem;">Failed to load tier list data.</p>';
  });

  // ── Render ──────────────────────────────────────────────────────────────────
  function renderTable(mode) {
    currentMode = mode;
    table.innerHTML = '';
    const tiers = tierData[mode];

    Object.entries(tiers).forEach(([tier, agents]) => {
      const { bg, text } = TIER_COLORS[tier] || { bg: '#333', text: '#fff' };

      const row = document.createElement('div');
      row.className = 'tier-row';
      row.setAttribute('data-tier', tier);

      const label = document.createElement('div');
      label.className   = 'tier-label';
      label.textContent = tier;
      label.style.backgroundColor = bg;
      label.style.color           = text;

      const agentsWrap = document.createElement('div');
      agentsWrap.className = 'tier-agents';

      agents.forEach(agentName => {
        const card = document.createElement('div');
        card.className = 'tier-agent-card';

        const iconSrc = agentIcons[agentName] || '';
        card.innerHTML = `
          <img src="${iconSrc}" alt="${agentName}" loading="lazy"
               onerror="this.src='../assets/media/logo.png'">
          <span>${agentName}</span>`;

        agentsWrap.appendChild(card);
      });

      row.appendChild(label);
      row.appendChild(agentsWrap);
      table.appendChild(row);
    });

    ScrollReveal && ScrollReveal({ distance: '20px', duration: 500, interval: 60 }).reveal('.tier-row');
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────
  btnPro.addEventListener('click', () => {
    if (currentMode === 'pro') return;
    btnPro.classList.add('active');
    btnRanked.classList.remove('active');
    modeNote.innerHTML = MODE_NOTES.pro;
    renderTable('pro');
  });

  btnRanked.addEventListener('click', () => {
    if (currentMode === 'ranked') return;
    btnRanked.classList.add('active');
    btnPro.classList.remove('active');
    modeNote.innerHTML = MODE_NOTES.ranked;
    renderTable('ranked');
  });
});
