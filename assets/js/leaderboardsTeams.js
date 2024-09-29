// Declare data, startIndex, and endIndex variables in a wider scope
let data = []; // Initialize as an empty array
let startIndex = 0;
let endIndex = 0;

// FUNCTIONS
document.addEventListener('DOMContentLoaded', () => {
    const nameFilter = document.getElementById('nameFilter');
    const regionSelect = document.querySelectorAll(".regionTeam");
    const searchButton = document.getElementById('searchButton'); // New Search Button
    const rankingsContainer = document.querySelector('.rankingsContainer');
    let currentPage = 1;

    function fetchTeams(region, name, page) {
        // Build the URL with the selected region
        const proxyServerUrl = `http://localhost/proxy/proxy.php?url=https://vlrggapi.vercel.app/rankings/${region}`;
        console.log(proxyServerUrl);

        // Fetch data from the API using the URL
        rankingsContainer.innerHTML = '';
        fetch(proxyServerUrl)
            .then((response) => response.json())
            .then((fetchedData) => {
                // Filter the data based on rank and name
                data = fetchedData.data; // Assign fetchedData to the global data variable
                console.log(data);

                // Filter the data based on rank and name
                let filteredData = data.filter((team) => {
                    const teamName = team.team.toLowerCase();
                    const filterName = name.toLowerCase();
                    return teamName.includes(filterName);
                });

                // Calculate startIndex and endIndex based on the filtered data
                const resultsPerPage = 10;
                startIndex = (page - 1) * resultsPerPage;
                endIndex = Math.min(startIndex + resultsPerPage, filteredData.length);

                // Create and append elements to display the filtered leaderboard data for the current page
                for (let i = startIndex; i < endIndex; i++) {
                    const team = filteredData[i];
                    const teamElement = document.createElement('div');
                    teamElement.classList.add('team');
                    if (team.rank === "1") {
                        teamElement.classList.add('first-place'); // Add a class for styling
                    }
                    teamElement.innerHTML = `
                        <div class="team-rank-container">
                            <h3 class="team-rank">${team.rank}</h3>
                        </div>
                        <div class="team-logo-container">
                            <img src="${team.logo}" alt="Team Logo" class="team-logo">
                        </div>
                        <div class="team-name-container">
                            <h2 class="team-name">${team.team}</h2>
                        </div>
                        <div class="team-country-container">
                            <p>
                                <span class="team-country">${team.country}</span>
                            </p>
                        </div>
                         <div class="team-earnings-container">
                            <p>
                                <span class="team-earnings">${team.earnings}</span>
                            </p>
                        </div>
                        <div class="team-record-container">
                            <p>
                                <span class="team-record">${team.record}</span>
                            </p>
                        </div>
                        `;
                    rankingsContainer.appendChild(teamElement);
                }

                updatePage();
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }

    regionSelect.forEach(button => {
        button.addEventListener('click', function () {
            const regionValue = this.getAttribute('value');
            fetchTeams(regionValue, nameFilter.value, currentPage);

            // Remove the "selected" class from all buttons
            regionSelect.forEach(btn => btn.classList.remove('selected'));

            // Add the "selected" class to the clicked button
            this.classList.add('selected');
        });
    });

    function updatePage() {
        // Your updatePage function remains the same
    }

// Add an event listener to the Previous Page button
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const selectedRegion = document.querySelector('.regionTeam.selected').getAttribute('value');
            const selectedName = nameFilter.value;
            fetchTeams(selectedRegion, selectedName, currentPage);
        }
    });

// Add an event listener to the Next Page button
    document.getElementById('nextPage').addEventListener('click', () => {
        if (endIndex < data.data.length) {
            currentPage++;
            const selectedRegion = document.querySelector('.regionTeam.selected').getAttribute('value');
            const selectedName = nameFilter.value;
            fetchTeams(selectedRegion, selectedName, currentPage);
        }
    });

// Add an event listener to the Search button
    searchButton.addEventListener('click', () => {
        const selectedRegion = document.querySelector('.regionTeam.selected').getAttribute('value');
        const selectedName = nameFilter.value;
        currentPage = 1; // Reset to the first page
        fetchTeams(selectedRegion, selectedName, currentPage);
    });

// Initial load with the "na" region selected and an empty name filter
    document.querySelector('.regionTeam[value="na"]').click(); // Simulate a click on the "na" button
});
