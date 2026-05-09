document.addEventListener('DOMContentLoaded', () => {
  const table      = document.getElementById('tierlistTable');
  const btnPro     = document.getElementById('btnPro');
  const btnRanked  = document.getElementById('btnRanked');
  const modeNote   = document.getElementById('modeNote');

  const TIER_COLORS = {
    'S+': { bg: '#FFD700', text: '#0f1923' },
    'S':  { bg: '#ff4655', text: '#fff'    },
    'A':  { bg: '#ff8c42', text: '#fff'    },
    'B':  { bg: '#f9c74f', text: '#0f1923' },
    'C':  { bg: '#4cc9f0', text: '#0f1923' },
    'D':  { bg: '#6c757d', text: '#fff'    },
  };

  // ACS thresholds for dynamic pro tier computation
  const ACS_THRESHOLDS = [
    { tier: 'S+', min: 260 },
    { tier: 'S',  min: 230 },
    { tier: 'A',  min: 210 },
    { tier: 'B',  min: 190 },
    { tier: 'C',  min: 170 },
    { tier: 'D',  min: 0   },
  ];

  let staticTierData = null;
  let dynamicProData = null;   // computed from /api/stats
  let agentIcons     = {};
  let currentMode    = 'pro';

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
  }

  // ── Compute tiers from v2/stats ACS data ───────────────────────────────────
  function computeProTiers(segments) {
    const bucket = {};
    segments.forEach(player => {
      const acs    = parseFloat(player.average_combat_score) || parseFloat(player.acs) || 0;
      if (!acs) return;
      // agents field is a string like "Neon / Jett" or an array
      let agents = player.agents;
      if (typeof agents === 'string') {
        agents = agents.split(/[\/,]/).map(a => a.trim());
      } else if (!Array.isArray(agents)) {
        agents = [agents].filter(Boolean);
      }
      agents.slice(0, 2).forEach(raw => {  // only primary agents carry weight
        if (!raw) return;
        const name = capitalize(raw.trim());
        if (!bucket[name]) bucket[name] = { total: 0, count: 0 };
        bucket[name].total += acs;
        bucket[name].count += 1;
      });
    });

    // Average ACS per agent; require ≥2 data points
    const ranked = Object.entries(bucket)
      .filter(([, v]) => v.count >= 2)
      .map(([name, v]) => ({ name, avgACS: v.total / v.count }))
      .sort((a, b) => b.avgACS - a.avgACS);

    const tiers = { 'S+': [], 'S': [], 'A': [], 'B': [], 'C': [], 'D': [] };
    ranked.forEach(({ name, avgACS }) => {
      const tier = ACS_THRESHOLDS.find(t => avgACS >= t.min)?.tier ?? 'D';
      tiers[tier].push(name);
    });
    return tiers;
  }

  // ── Render tier table ──────────────────────────────────────────────────────
  function renderTable(tierMap) {
    table.innerHTML = '';
    const isEmpty = Object.values(tierMap).every(a => !a.length);
    if (isEmpty) {
      table.innerHTML = '<p style="color:#ff4655;padding:2rem;">No tier data available.</p>';
      return;
    }

    Object.entries(tierMap).forEach(([tier, agents]) => {
      if (!agents.length) return;
      const { bg, text } = TIER_COLORS[tier] || { bg: '#333', text: '#fff' };

      const row = document.createElement('div');
      row.className = 'tier-row';
      row.setAttribute('data-tier', tier);

      const label = document.createElement('div');
      label.className           = 'tier-label';
      label.textContent         = tier;
      label.style.backgroundColor = bg;
      label.style.color           = text;

      const agentsWrap = document.createElement('div');
      agentsWrap.className = 'tier-agents';

      agents.forEach(agentName => {
        const card = document.createElement('div');
        card.className = 'tier-agent-card';
        const iconSrc  = agentIcons[agentName] || '';
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

    if (typeof ScrollReveal !== 'undefined') {
      ScrollReveal({ distance: '20px', duration: 400, interval: 50 }).reveal('.tier-row');
    }
  }

  // ── Set active mode ────────────────────────────────────────────────────────
  function setMode(mode) {
    currentMode = mode;
    btnPro.classList.toggle('active', mode === 'pro');
    btnRanked.classList.toggle('active', mode === 'ranked');

    if (mode === 'pro' && dynamicProData) {
      modeNote.innerHTML = 'Computed from VCT pro stats — averaged ACS per agent across top performers.';
      renderTable(dynamicProData);
    } else if (mode === 'pro' && staticTierData) {
      modeNote.innerHTML = 'Based on current VCT meta &amp; pick rates.';
      renderTable(staticTierData.pro || {});
    } else if (mode === 'ranked' && staticTierData) {
      modeNote.innerHTML = 'Community consensus — Immortal+ ranked win-rate data.';
      renderTable(staticTierData.ranked || {});
    }
  }

  // ── Load everything in parallel ────────────────────────────────────────────
  Promise.all([
    fetch('https://valorant-api.com/v1/agents').then(r => r.json()),
    fetch(`${CONFIG.API_BASE_URL}/api/tierlist`).then(r => r.json()).catch(() => null),
    fetch(`${CONFIG.API_BASE_URL}/api/stats?region=na&timespan=60`).then(r => r.json()).catch(() => null),
  ])
  .then(([agentsRes, tierRes, statsRes]) => {
    // Build agent icon map
    (agentsRes?.data || []).forEach(agent => {
      if (agent.isPlayableCharacter) {
        agentIcons[agent.displayName] = agent.displayIconSmall;
      }
    });

    staticTierData = tierRes;

    // Try to compute dynamic pro tiers from stats
    const segments = statsRes?.data?.segments ?? statsRes?.data ?? null;
    if (Array.isArray(segments) && segments.length) {
      dynamicProData = computeProTiers(segments);
    }

    setMode('pro');
  })
  .catch(() => {
    table.innerHTML = '<p style="color:#ff4655;padding:2rem;">Failed to load tier list data.</p>';
  });

  btnPro.addEventListener('click',    () => setMode('pro'));
  btnRanked.addEventListener('click', () => setMode('ranked'));
});
