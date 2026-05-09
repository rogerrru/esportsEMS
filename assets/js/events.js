let data = [];
let startIndex = 0;
let endIndex   = 0;

document.addEventListener('DOMContentLoaded', () => {
  const nameFilter   = document.getElementById('nameFilter');
  const eventSelect  = document.getElementById('eventSelect');
  const statusSelect = document.getElementById('statusSelect');
  const searchButton = document.getElementById('searchButton');
  const rankingsContainer = document.querySelector('.rankingsContainer');
  let currentPage = 1;

  function fetchAndDisplayEvents(eventName, selectEvent, eventStatus, page) {
    const apiUrl = `${CONFIG.API_BASE_URL}/api/match/${eventStatus}`;
    rankingsContainer.innerHTML = '';

    fetch(apiUrl)
      .then(r => r.json())
      .then(fetchedData => {
        data = fetchedData.data;

        // Populate tournament dropdown (deduplicated)
        const tournamentNames = new Set(data.segments.map(e => e.tournament_name));
        eventSelect.innerHTML = '<option value="">All Tournaments</option>';
        tournamentNames.forEach(name => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.text  = name;
          eventSelect.appendChild(opt);
        });

        const filterName   = eventName.toLowerCase();
        const filterSelect = selectEvent.toLowerCase();
        const filteredData = data.segments.filter(event => {
          const name = event.tournament_name.toLowerCase();
          return name.includes(filterName) && name.includes(filterSelect);
        });

        const resultsPerPage = 10;
        startIndex = (page - 1) * resultsPerPage;
        endIndex   = Math.min(startIndex + resultsPerPage, filteredData.length);

        for (let i = startIndex; i < endIndex; i++) {
          const event = filteredData[i];
          const el    = document.createElement('li');
          el.classList.add('event');
          el.innerHTML = `
            <div class="event-tourn"><h3 class="round">${event.tournament_name}</h3></div>
            <div class="event-round"><h3 class="round">${event.round_info}</h3></div>
            <div class="team-container">
              <h3 class="team1">${event.team1}</h3>
              <h3 class="team2">${event.team2}</h3>
            </div>
            <div class="score-container">
              <h2 class="score1">${event.score1}</h2>
              <h2 class="score2">${event.score2}</h2>
            </div>`;
          rankingsContainer.appendChild(el);
        }

        updatePageButtons(filteredData.length);
      })
      .catch(err => console.error('Events fetch error:', err));
  }

  function updatePageButtons(totalItems) {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = endIndex >= totalItems;
  }

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    if (endIndex < data.segments.length) {
      currentPage++;
      fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
    }
  });

  searchButton.addEventListener('click', () =>
    fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage)
  );

  eventSelect.addEventListener('change', () =>
    fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage)
  );

  statusSelect.addEventListener('change', () => {
    currentPage = 1;
    fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
  });

  fetchAndDisplayEvents('', '', 'upcoming', currentPage);
});
