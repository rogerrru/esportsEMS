let data = [];
let startIndex = 0;
let endIndex   = 0;

document.addEventListener('DOMContentLoaded', () => {
  const nameFilter   = document.getElementById('nameFilter');
  const regionBtns   = document.querySelectorAll('.regionTeam');
  const searchButton = document.getElementById('searchButton');
  const rankingsContainer = document.querySelector('.rankingsContainer');
  let currentPage = 1;

  function fetchTeams(region, name, page) {
    const apiUrl = `${CONFIG.API_BASE_URL}/api/rankings/${region}`;
    rankingsContainer.innerHTML = '';

    fetch(apiUrl)
      .then(r => r.json())
      .then(fetchedData => {
        data = fetchedData.data;

        const filterName   = name.toLowerCase();
        const filteredData = data.filter(team =>
          team.team.toLowerCase().includes(filterName)
        );

        const resultsPerPage = 10;
        startIndex = (page - 1) * resultsPerPage;
        endIndex   = Math.min(startIndex + resultsPerPage, filteredData.length);

        for (let i = startIndex; i < endIndex; i++) {
          const team = filteredData[i];
          const el   = document.createElement('div');
          el.classList.add('team');
          if (team.rank === '1') el.classList.add('first-place');
          el.innerHTML = `
            <div class="team-rank-container"><h3 class="team-rank">${team.rank}</h3></div>
            <div class="team-logo-container">
              <img src="${team.logo}" alt="Team Logo" class="team-logo" loading="lazy">
            </div>
            <div class="team-name-container"><h2 class="team-name">${team.team}</h2></div>
            <div class="team-country-container"><p><span class="team-country">${team.country}</span></p></div>
            <div class="team-earnings-container"><p><span class="team-earnings">${team.earnings}</span></p></div>
            <div class="team-record-container"><p><span class="team-record">${team.record}</span></p></div>`;
          rankingsContainer.appendChild(el);
        }

        updatePageButtons(filteredData.length);
      })
      .catch(err => console.error('Teams fetch error:', err));
  }

  function updatePageButtons(totalItems) {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = endIndex >= totalItems;
  }

  function getSelectedRegion() {
    const active = document.querySelector('.regionTeam.selected');
    return active ? active.getAttribute('value') : 'na';
  }

  regionBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      regionBtns.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      currentPage = 1;
      fetchTeams(this.getAttribute('value'), nameFilter.value, currentPage);
    });
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchTeams(getSelectedRegion(), nameFilter.value, currentPage);
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    if (endIndex < data.length) {
      currentPage++;
      fetchTeams(getSelectedRegion(), nameFilter.value, currentPage);
    }
  });

  searchButton.addEventListener('click', () => {
    currentPage = 1;
    fetchTeams(getSelectedRegion(), nameFilter.value, currentPage);
  });

  // Initial load — click NA button
  document.querySelector('.regionTeam[value="na"]').click();
});
