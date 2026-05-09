document.addEventListener('DOMContentLoaded', () => {
  const nameFilter        = document.getElementById('nameFilter');
  const regionBtns        = document.querySelectorAll('.regionTeam');
  const searchButton      = document.getElementById('searchButton');
  const rankingsContainer = document.querySelector('.rankingsContainer');

  const PER_PAGE   = 10;
  let allTeams     = [];
  let filteredTeams= [];
  let currentPage  = 1;

  // v2 /rankings returns either { data: [...] } or { data: { segments: [...] } }
  function extractTeams(json) {
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.data?.segments)) return json.data.segments;
    return [];
  }

  async function fetchTeams(region, name) {
    rankingsContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;">Loading…</p>';
    try {
      const res  = await fetch(`${CONFIG.API_BASE_URL}/api/rankings/${region}`);
      const json = await res.json();
      allTeams   = extractTeams(json);

      applyFilter(name);
    } catch (err) {
      console.error('Teams fetch error:', err);
      rankingsContainer.innerHTML = '<p style="padding:2rem;color:#ff4655;text-align:center;">Failed to load rankings.</p>';
    }
  }

  function applyFilter(name) {
    const q = (name || '').toLowerCase();
    filteredTeams = q
      ? allTeams.filter(t => (t.team || '').toLowerCase().includes(q))
      : allTeams;
    currentPage = 1;
    renderPage();
  }

  function renderPage() {
    rankingsContainer.innerHTML = '';
    const start = (currentPage - 1) * PER_PAGE;
    const slice = filteredTeams.slice(start, start + PER_PAGE);

    if (!slice.length) {
      rankingsContainer.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;">No teams found.</p>';
    } else {
      slice.forEach(team => {
        const el = document.createElement('div');
        el.classList.add('team');
        if (team.rank === '1' || team.rank === 1) el.classList.add('first-place');
        el.innerHTML = `
          <div class="team-rank-container"><h3 class="team-rank">${team.rank || '—'}</h3></div>
          <div class="team-logo-container">
            <img src="${team.logo || ''}" alt="${team.team}" class="team-logo" loading="lazy"
                 onerror="this.style.display='none'">
          </div>
          <div class="team-name-container"><h2 class="team-name">${team.team || '—'}</h2></div>
          <div class="team-country-container"><p><span class="team-country">${team.country || '—'}</span></p></div>
          <div class="team-earnings-container"><p><span class="team-earnings">${team.earnings || '—'}</span></p></div>
          <div class="team-record-container"><p><span class="team-record">${team.record || '—'}</span></p></div>`;
        rankingsContainer.appendChild(el);
      });
    }

    const totalPages = Math.ceil(filteredTeams.length / PER_PAGE) || 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
  }

  function getSelectedRegion() {
    const active = document.querySelector('.regionTeam.selected');
    return active ? active.getAttribute('value') : 'na';
  }

  regionBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      regionBtns.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      fetchTeams(this.getAttribute('value'), nameFilter.value);
    });
  });

  document.getElementById('prevPage').addEventListener('click', () => { currentPage--; renderPage(); });
  document.getElementById('nextPage').addEventListener('click', () => { currentPage++; renderPage(); });
  searchButton.addEventListener('click', () => applyFilter(nameFilter.value));
  nameFilter.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilter(nameFilter.value); });

  document.querySelector('.regionTeam[value="na"]').click();
});
