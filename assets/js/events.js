document.addEventListener('DOMContentLoaded', () => {
  // ── Tournament section ─────────────────────────────────────────────────────
  const eventsGrid  = document.getElementById('eventsGrid');
  const eventsTabs  = document.querySelectorAll('.events-tab');

  async function fetchTournaments(q) {
    eventsGrid.innerHTML = '<div class="events-loading">Loading tournaments…</div>';
    try {
      const res  = await fetch(`${CONFIG.API_BASE_URL}/api/events?q=${q}`);
      const json = await res.json();
      const segments = json?.data?.segments ?? json?.data ?? [];

      if (!segments.length) {
        eventsGrid.innerHTML = `<div class="events-empty">No ${q} tournaments found.</div>`;
        return;
      }

      eventsGrid.innerHTML = '';
      segments.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'event-card';

        const imgHtml = ev.img
          ? `<img src="${ev.img}" alt="${ev.title}" class="event-card-img" loading="lazy">`
          : `<div class="event-card-img-placeholder">VCT</div>`;

        const status = (ev.status || q).toLowerCase();
        const prize  = ev.prizepool || ev.prize || '';
        const region = ev.region || ev.country || '';
        const dates  = ev.dates  || ev.date   || '';

        card.innerHTML = `
          ${imgHtml}
          <div class="event-card-body">
            <div class="event-card-title">${ev.title || ev.name || 'Tournament'}</div>
            <div class="event-card-meta">
              ${region ? `<span class="event-tag event-tag-region">${region}</span>` : ''}
              ${dates  ? `<span class="event-tag event-tag-dates">${dates}</span>` : ''}
            </div>
            ${prize ? `<div class="event-card-prize">${prize}</div>` : ''}
            <span class="event-card-status ${status}">${status}</span>
          </div>`;

        eventsGrid.appendChild(card);
      });
    } catch (err) {
      console.error('Tournaments fetch error:', err);
      eventsGrid.innerHTML = '<div class="events-empty">Failed to load tournaments.</div>';
    }
  }

  eventsTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      eventsTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      fetchTournaments(this.dataset.q);
    });
  });

  fetchTournaments('upcoming');

  // ── Match section ──────────────────────────────────────────────────────────
  const matchList        = document.getElementById('matchList');
  const matchTabs        = document.querySelectorAll('.match-tab');
  const matchSearchEl    = document.getElementById('matchSearch');
  const tournamentFilter = document.getElementById('tournamentFilter');
  const prevBtn          = document.getElementById('prevPage');
  const nextBtn          = document.getElementById('nextPage');
  const pageInfoEl       = document.getElementById('pageInfo');

  const PER_PAGE   = 10;
  let matchData    = [];
  let filteredData = [];
  let currentPage  = 1;

  async function fetchMatches(q) {
    currentPage = 1;
    matchList.innerHTML = '<div class="events-loading">Loading matches…</div>';
    try {
      const res  = await fetch(`${CONFIG.API_BASE_URL}/api/match?q=${q}`);
      const json = await res.json();
      matchData  = json?.data?.segments ?? json?.data ?? [];

      const names = new Set(matchData.map(m => m.tournament_name).filter(Boolean));
      tournamentFilter.innerHTML = '<option value="">All Tournaments</option>';
      names.forEach(n => {
        const opt = document.createElement('option');
        opt.value = opt.text = n;
        tournamentFilter.appendChild(opt);
      });

      applyFilters();
    } catch (err) {
      console.error('Match fetch error:', err);
      matchList.innerHTML = '<div class="events-empty">Failed to load matches.</div>';
    }
  }

  function applyFilters() {
    const searchVal = matchSearchEl.value.toLowerCase();
    const tournVal  = tournamentFilter.value.toLowerCase();

    filteredData = matchData.filter(m => {
      const text    = `${m.team1} ${m.team2} ${m.tournament_name}`.toLowerCase();
      const inSearch = text.includes(searchVal);
      const inTourn  = !tournVal || (m.tournament_name || '').toLowerCase().includes(tournVal);
      return inSearch && inTourn;
    });

    currentPage = 1;
    renderPage();
  }

  function renderPage() {
    matchList.innerHTML = '';
    const start = (currentPage - 1) * PER_PAGE;
    const slice = filteredData.slice(start, start + PER_PAGE);

    if (!slice.length) {
      matchList.innerHTML = '<div class="events-empty">No matches found.</div>';
    } else {
      slice.forEach(m => {
        const row = document.createElement('div');
        row.className = 'match-row';

        const s1 = parseInt(m.score1 ?? -1);
        const s2 = parseInt(m.score2 ?? -1);
        const has = s1 >= 0 && s2 >= 0;

        row.innerHTML = `
          <div class="match-tourn">${m.tournament_name || '—'}</div>
          <div class="match-round">${m.round_info || '—'}</div>
          <div class="match-teams">
            <span class="match-team-name">${m.team1 || '—'}</span>
            <span class="match-team-name">${m.team2 || '—'}</span>
          </div>
          <div class="match-score-wrap">
            <span class="match-score ${has ? (s1 > s2 ? 'winner' : 'loser') : ''}">${has ? m.score1 : (m.time_until_match || '—')}</span>
            <span class="match-score ${has ? (s2 > s1 ? 'winner' : 'loser') : ''}">${has ? m.score2 : ''}</span>
          </div>`;
        matchList.appendChild(row);
      });
    }

    const totalPages = Math.ceil(filteredData.length / PER_PAGE) || 1;
    pageInfoEl.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  matchTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      matchTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      fetchMatches(this.dataset.q);
    });
  });

  matchSearchEl.addEventListener('input', applyFilters);
  tournamentFilter.addEventListener('change', applyFilters);
  prevBtn.addEventListener('click', () => { currentPage--; renderPage(); });
  nextBtn.addEventListener('click', () => { currentPage++; renderPage(); });

  fetchMatches('upcoming');
});
