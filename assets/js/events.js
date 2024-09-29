// Declare data, startIndex, and endIndex variables in a wider scope
let data = []; // Initialize as an empty array
let startIndex = 0;
let endIndex = 0;

// FUNCTIONS
document.addEventListener('DOMContentLoaded', () => {
    const nameFilter = document.getElementById('nameFilter');
    const eventSelect = document.getElementById('eventSelect');
    const statusSelect = document.getElementById(`statusSelect`)
    const searchButton = document.getElementById('searchButton'); // New Search Button
    const rankingsContainer = document.querySelector('.rankingsContainer');
    let currentPage = 1;

    //eventname = round_info, eventStatus = upcoming/results,
    function fetchAndDisplayEvents(eventName, selectEvent, eventStatus, page) {
        // Build the URL with the selected region
        const apiUrl = `http://localhost/proxy/proxy.php?url=https://vlrggapi.vercel.app/match/${eventStatus}`;
        console.log(apiUrl);

        // Fetch data from the API using the URL
        rankingsContainer.innerHTML = '';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((fetchedData) => {
                // Filter the data based on rank and name
                data = fetchedData.data; // Assign fetchedData to the global data variable
                console.log(data);
                //set to store names
                const tournamentNames = new Set();
                // Loop through the events and add their names to the Set
                data.segments.forEach((event) => {
                    const eventName = event.tournament_name;
                    tournamentNames.add(eventName);
                });
                tournamentNames.forEach((event) => {
                    const option = document.createElement('option');
                    option.value = event;
                    option.text = event;
                    // Append the option to the select element
                    eventSelect.appendChild(option);
                });


                // Filter the data based on rank and name
                let filteredData = data.segments.filter((event) => {
                    const eName = `${event.tournament_name.toLowerCase()}`;
                    const filterName = eventName.toLowerCase();
                    const eSelectEvent = selectEvent.toLowerCase();
                    return (eName.includes(filterName)  && eName.includes(eSelectEvent));
                });

                // Calculate startIndex and endIndex based on the filtered data
                const resultsPerPage = 10;
                startIndex = (page - 1) * resultsPerPage;
                endIndex = Math.min(startIndex + resultsPerPage, filteredData.length);

                // Create and append elements to display the filtered leaderboard data for the current page
                for (let i = startIndex; i < endIndex; i++) {
                    const event = filteredData[i];
                    const eventElement = document.createElement('li');
                    eventElement.classList.add('event');
                    eventElement.innerHTML = `
                        <div class = "event-tourn">
                            <h3 class="round">${event.tournament_name}</h3>
                        </div>
                        <div class = "event-round">
                            <h3 class="round">${event.round_info}</h3>
                        </div>
                        <div class = "team-container">
                            <h3 class="team1">${event.team1}</h3>
                            <h3 class="team2">${event.team2}</h3>
                        </div>
                        <div class="score-container">
                            <h2 class="score1">${event.score1}</h2>
                            <h2 class="score2">${event.score2}</h2>
                        </div>
                    `;
                    rankingsContainer.appendChild(eventElement);
                    console.log(eventElement);
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
        nextPageButton.disabled = endIndex >= data.segments.length;
    }

    // Add event listeners to the page buttons
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (endIndex < data.data.length) {
            currentPage++;
            fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
        }
    });

    // Add an event listener to the new Search button
    searchButton.addEventListener('click', () => {
        fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
    });

    // Add event listeners to the filters
    eventSelect.addEventListener('change', () => {
        fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
    });
    statusSelect.addEventListener('change', () => {
        fetchAndDisplayEvents(nameFilter.value, eventSelect.value, statusSelect.value, currentPage);
    });
    fetchAndDisplayEvents('', '','upcoming', currentPage);
});
