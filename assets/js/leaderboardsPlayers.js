document.addEventListener('DOMContentLoaded', () => {
  const nameFilter        = document.getElementById('nameFilter');
  const regionSelect      = document.getElementById('regionSelect');
  const rankSelect        = document.getElementById('rankSelect');
  const searchButton      = document.getElementById('searchButton');
  const rankingsContainer = document.querySelector('.rankingsContainer');

  const PER_PAGE = 10;
  let allPlayers   = [];
  let filteredData = [];
  let currentPage  = 1;

  // competitiveTier values from Riot API (post-Ascendant): 27=Radiant, 26=Imm3, 25=Imm2, 24=Imm1
  const TIER_BADGE = {
    27: '../assets/media/leaderboards-radiant-badge.png',
    26: '../assets/media/leaderboards-immortal-badge.png',
    25: '../assets/media/leaderboards-immortal-badge.png',
    24: '../assets/media/leaderboards-immortal-badge.png',
  };
  const TIER_NAME = { 27: 'Radiant', 26: 'Immortal 3', 25: 'Immortal 2', 24: 'Immortal 1' };

  async function fetchLeaderboard(region) {
    rankingsContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;">Loading…</p>';
    try {
      const res  = await fetch(`${CONFIG.API_BASE_URL}/api/val/leaderboard/${region}?size=200`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      allPlayers = json.players || [];
      applyFilters();
    } catch (err) {
      console.error('Leaderboard error:', err);
      rankingsContainer.innerHTML =
        `<p style="padding:2rem;color:#ff4655;text-align:center;">Failed to load leaderboard: ${err.message}</p>`;
    }
  }

  function applyFilters() {
    const name       = nameFilter.value.toLowerCase();
    const tierFilter = parseInt(rankSelect.value);

    filteredData = allPlayers.filter(p => {
      const tag         = `${p.gameName}#${p.tagLine}`.toLowerCase();
      const matchesName = !name || tag.includes(name);
      const matchesTier = tierFilter === 0 || p.competitiveTier === tierFilter;
      return matchesName && matchesTier;
    });

    currentPage = 1;
    renderPage();
  }

  function renderPage() {
    rankingsContainer.innerHTML = '';
    const start = (currentPage - 1) * PER_PAGE;
    const slice = filteredData.slice(start, start + PER_PAGE);

    if (!slice.length) {
      rankingsContainer.innerHTML =
        '<p style="padding:2rem;text-align:center;color:#888;">No players found.</p>';
    } else {
      slice.forEach(p => {
        const el  = document.createElement('li');
        el.classList.add('player');
        if (p.leaderboardRank === 1) el.classList.add('first-place');

        const badge = TIER_BADGE[p.competitiveTier] || TIER_BADGE[24];
        const label = TIER_NAME[p.competitiveTier]  || 'Immortal';

        el.innerHTML = `
          <div class="player-rank-container">
            <h3 class="player-rank">${p.leaderboardRank}</h3>
          </div>
          <div class="player-rating-container">
            <img class="icon-container" src="${badge}" alt="${label}">
            <h2 class="player-points">${p.rankedRating}</h2>
          </div>
          <div class="player-name-container">
            <h2 class="player-name">${p.gameName}<span>#${p.tagLine}</span></h2>
          </div>
          <div class="player-wins-container">
            <p><span class="player-wins">${p.numberOfWins}</span> <span>Games Won</span></p>
          </div>`;
        rankingsContainer.appendChild(el);
      });
    }

    const totalPages = Math.ceil(filteredData.length / PER_PAGE) || 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
  }

  regionSelect.addEventListener('change', () => fetchLeaderboard(regionSelect.value));
  rankSelect.addEventListener('change', applyFilters);
  searchButton.addEventListener('click', applyFilters);
  nameFilter.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilters(); });
  document.getElementById('prevPage').addEventListener('click', () => { currentPage--; renderPage(); });
  document.getElementById('nextPage').addEventListener('click', () => { currentPage++; renderPage(); });

  fetchLeaderboard('na');
});
