document.querySelector(".navbar").innerHTML = `
    <a href="index.html" class="nav-logo"><img src="../assets/media/logo.png" alt="" />.</a>
    <ul class="nav-menu">
        <li class="nav-item">
            <a href="index.html" class="nav-link">
                <p>Overview</p>
                <div class="desktop-link-item-underline">
                </div>
            </a>
        </li>
         <li class="nav-item">
            <a href="events.html" class="nav-link">
                <p>Events</p>
                <div class="desktop-link-item-underline">
                </div>
            </a>
        </li>
        <li class="nav-item">
            <div class = "nav-link-submenu">
                <h1>Leaderboards</h1>
                <ul class="subMenu">
                    <div class="desktop-link-item-underline"></div>
                    <li class="player-subMenu">
                        <a href="leaderboardsPlayers.html" class="nav-link-submenu">
                            <p>
                                PLAYERS
                            </p>
                        </a>
                    </li>
                    <li class="teams-subMenu">
                        <a href="leaderboardsTeams.html" class="nav-link-submenu">
                            <p>TEAMS</p>
                        </a>
                    </li>
                </ul>
                <div class="desktop-link-item-underline"></div>
            </div>
        </li>
        <li class="nav-item">
            <a href="agents.html" class="nav-link">
                <p>Agents</p>
                <div class="desktop-link-item-underline">
                </div>
            </a>
        </li>
        <li class="nav-item">
            <a href="support.html" class="nav-link">
                <p>Support</p>
                <div class="desktop-link-item-underline">
                </div>
            </a>
        </li>
    </ul>
    <div class="hamburger">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
`;
