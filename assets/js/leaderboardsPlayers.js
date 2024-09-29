// Declare data, startIndex, and endIndex variables in a wider scope
let data = []; // Initialize as an empty array
let startIndex = 0;
let endIndex = 0;

// FUNCTIONS
document.addEventListener('DOMContentLoaded', () => {
    const nameFilter = document.getElementById('nameFilter');
    const regionSelect = document.getElementById('regionSelect');
    const rankSelect = document.getElementById('rankSelect');
    const seasonSelect = document.getElementById('seasonSelect');
    const searchButton = document.getElementById('searchButton'); // New Search Button
    const rankingsContainer = document.querySelector('.rankingsContainer');
    let currentPage = 1;

    function fetchAndDisplayLeaderboard(region, rank, name, page, season) {
        // Build the URL with the selected region
        const apiUrl = `https://api.henrikdev.xyz/valorant/v2/leaderboard/${region}?season=${season}`;
        console.log(apiUrl);

        // Get the selected rank from the dropdown
        const selectedRank = parseInt(rank);

        // Fetch data from the API using the URL
        rankingsContainer.innerHTML = '';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((fetchedData) => {
                // Filter the data based on rank and name
                data = fetchedData; // Assign fetchedData to the global data variable
                console.log(data);

                const rankMappings = [data.radiant_threshold, data.immortal_3_threshold, data.immortal_2_threshold, data.immortal_1_threshold];
                console.log(rankMappings);

                // Filter the data based on rank and name
                let filteredData = data.players.filter((player) => {
                    const playerName = `${player.gameName.toLowerCase()}#${player.tagLine.toLowerCase()}`;
                    const filterName = name.toLowerCase();
                    const playerRankedRating = parseInt(player.rankedRating);

                    return (
                        playerName.includes(filterName) &&
                        (
                            (rankMappings[selectedRank] === 450 && playerRankedRating >= 450) ||
                            (rankMappings[selectedRank] === 200 && playerRankedRating >= 200 && playerRankedRating < 450) ||
                            (rankMappings[selectedRank] === 90 && playerRankedRating >= 90 && playerRankedRating < 200) ||
                            (rankMappings[selectedRank] === 0 && playerRankedRating > 0 && playerRankedRating < 90)
                        )
                    );
                });

                // Calculate startIndex and endIndex based on the filtered data
                const resultsPerPage = 10;
                startIndex = (page - 1) * resultsPerPage;
                endIndex = Math.min(startIndex + resultsPerPage, filteredData.length);

                // Create and append elements to display the filtered leaderboard data for the current page
                for (let i = startIndex; i < endIndex; i++) {
                    const player = filteredData[i];
                    const playerElement = document.createElement('li');
                    playerElement.classList.add('player');
                    if (player.leaderboardRank === 1) {
                        playerElement.classList.add('first-place'); // Add a class for styling
                    }
                    playerElement.innerHTML = `
                        <div class = "player-rank-container">
                            <h3 class="player-rank">${player.leaderboardRank}
                            </h3>
                        </div>
                        <div class="player-rating-container">
                            <img class = "icon-container"/>
                            <h2 class="player-points">${player.rankedRating}</h2>
                        </div>
                        <div class="player-name-container">
                            <h2 class="player-name">${player.gameName}<span>#${player.tagLine}</span>
                            </h2>
                        </div>
                        <div  class="player-wins-container">
                            <p>
                                <span class="player-wins">${player.numberOfWins}
                                </span>
                                <span>Games Won</span>

                            </p>
                        </div>
                    `;
                    rankingsContainer.appendChild(playerElement);
                    const rankImg = playerElement.querySelector('.icon-container');
                    if (rankMappings[selectedRank] === 450 && player.rankedRating >= 450) {
                        rankImg.src = "/assets/media/leaderboards-radiant-badge.png";
                        rankImg.alt = "Radiant Badge";
                    } else if (
                        rankMappings[selectedRank] === 200 && player.rankedRating >= 200 && player.rankedRating < 450 ||
                        rankMappings[selectedRank] === 90 && player.rankedRating >= 90 && player.rankedRating < 200 ||
                        rankMappings[selectedRank] === 0 && player.rankedRating > 0 && player.rankedRating < 90
                    ) {
                        rankImg.src = "/assets/media/leaderboards-immortal-badge.png";
                        rankImg.alt = "Immortal Badge";
                    }
                }
                updatePageButtons();
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }

    function updatePageButtons() {
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = endIndex >= data.players.length;
    }

    // Add event listeners to the page buttons
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayLeaderboard(regionSelect.value, parseInt(rankSelect.value), nameFilter.value, currentPage, seasonSelect.value);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (endIndex < data.players.length) {
            currentPage++;
            fetchAndDisplayLeaderboard(regionSelect.value, parseInt(rankSelect.value), nameFilter.value, currentPage, seasonSelect.value);
        }
    });

    // Add an event listener to the new Search button
    searchButton.addEventListener('click', () => {
        fetchAndDisplayLeaderboard(regionSelect.value, parseInt(rankSelect.value), nameFilter.value, 1, seasonSelect.value);
    });

    // Add event listeners to the filters
    regionSelect.addEventListener('change', () => {
        fetchAndDisplayLeaderboard(regionSelect.value, parseInt(rankSelect.value), nameFilter.value, 1, seasonSelect.value);
    });

    rankSelect.addEventListener('change', () => {
        fetchAndDisplayLeaderboard(regionSelect.value, parseInt(rankSelect.value), nameFilter.value, 1, seasonSelect.value);
    });
    seasonSelect.addEventListener('change', () => {
        fetchAndDisplayLeaderboard(regionSelect.value, parseInt(rankSelect.value), nameFilter.value, 1, seasonSelect.value);
    });
    fetchAndDisplayLeaderboard('na', 0, '', currentPage, 'e7a3');
});
