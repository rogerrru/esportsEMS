// Detect active page for nav link highlighting
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function isActive(href) {
  return currentPage === href ? 'nav-link--active' : '';
}

document.querySelector('.navbar').innerHTML = `
  <a href="index.html" class="nav-logo">
    <img src="../assets/media/logo.png" alt="ValoWiki logo" />
    <span class="nav-brand">VALO<em>WIKI</em></span>
  </a>

  <ul class="nav-menu" id="navMenu">
    <li class="nav-item">
      <a href="index.html" class="nav-link ${isActive('index.html')}">
        <p>News</p>
        <div class="desktop-link-item-underline"></div>
      </a>
    </li>
    <li class="nav-item">
      <a href="events.html" class="nav-link ${isActive('events.html')}">
        <p>Events</p>
        <div class="desktop-link-item-underline"></div>
      </a>
    </li>
    <li class="nav-item nav-item--dropdown">
      <div class="nav-link nav-link--parent ${isActive('leaderboardsTeams.html') || isActive('leaderboardsPlayers.html')}">
        <p>Leaderboards ▾</p>
        <div class="desktop-link-item-underline"></div>
      </div>
      <ul class="subMenu">
        <li><a href="leaderboardsPlayers.html" class="submenu-link">Players</a></li>
        <li><a href="leaderboardsTeams.html"   class="submenu-link">Teams</a></li>
      </ul>
    </li>
    <li class="nav-item">
      <a href="agents.html" class="nav-link ${isActive('agents.html')}">
        <p>Agents</p>
        <div class="desktop-link-item-underline"></div>
      </a>
    </li>
    <li class="nav-item">
      <a href="lineups.html" class="nav-link ${isActive('lineups.html')}">
        <p>Lineups</p>
        <div class="desktop-link-item-underline"></div>
      </a>
    </li>
    <li class="nav-item">
      <a href="tier-list.html" class="nav-link ${isActive('tier-list.html')}">
        <p>Tier List</p>
        <div class="desktop-link-item-underline"></div>
      </a>
    </li>
    <li class="nav-item">
      <a href="support.html" class="nav-link ${isActive('support.html')}">
        <p>Support</p>
        <div class="desktop-link-item-underline"></div>
      </a>
    </li>
  </ul>

  <div class="nav-actions">
    <button class="nav-search-btn" id="navSearchBtn" aria-label="Search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </button>
    <div class="hamburger" id="hamburger">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>
  </div>
`;

// Inject search overlay after navbar
const searchOverlay = document.createElement('div');
searchOverlay.id        = 'searchOverlay';
searchOverlay.className = 'search-overlay';
searchOverlay.innerHTML = `
  <div class="search-overlay-inner">
    <input type="text" id="globalSearch" placeholder="Search agents, teams, players, news…" autocomplete="off" />
    <button id="searchOverlayClose" aria-label="Close search">✕</button>
  </div>
  <div id="searchResults" class="search-results"></div>`;
document.querySelector('.navbar').insertAdjacentElement('afterend', searchOverlay);

// ── Scroll effect — darken + blur on scroll ────────────────────────────────
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').classList.toggle('navbar--scrolled', window.scrollY > 50);
}, { passive: true });

// ── Hamburger ──────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  navMenu.querySelectorAll('.nav-link, .submenu-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ── Search overlay ─────────────────────────────────────────────────────────
const searchBtn   = document.getElementById('navSearchBtn');
const closeBtn    = document.getElementById('searchOverlayClose');
const searchInput = document.getElementById('globalSearch');
const resultsEl   = document.getElementById('searchResults');

let searchTimer;

function openSearch() {
  searchOverlay.classList.add('open');
  searchInput.focus();
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
  resultsEl.innerHTML = '';
}

searchBtn.addEventListener('click',  openSearch);
closeBtn.addEventListener('click',   closeSearch);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = searchInput.value.trim();
  if (q.length < 2) { resultsEl.innerHTML = ''; return; }
  searchTimer = setTimeout(() => runSearch(q), 350);
});

async function runSearch(q) {
  resultsEl.innerHTML = '<p class="search-hint">Searching…</p>';
  try {
    // Check if CONFIG is available (it may not be on all pages)
    if (typeof CONFIG === 'undefined') return;
    const res  = await fetch(`${CONFIG.API_BASE_URL}/api/search?q=${encodeURIComponent(q)}`);
    const json = await res.json();
    const hits = json?.data?.segments ?? json?.data ?? json?.results ?? [];

    if (!hits.length) {
      resultsEl.innerHTML = '<p class="search-hint">No results found.</p>';
      return;
    }

    resultsEl.innerHTML = hits.slice(0, 8).map(hit => {
      const name = hit.player || hit.team || hit.name || q;
      const sub  = hit.org   || hit.country || hit.type || '';
      const img  = hit.img   || hit.logo    || '';
      return `
        <div class="search-result-item">
          ${img ? `<img src="${img}" alt="" class="search-result-img" loading="lazy">` : '<div class="search-result-img-placeholder"></div>'}
          <div class="search-result-text">
            <span class="search-result-name">${name}</span>
            ${sub ? `<span class="search-result-sub">${sub}</span>` : ''}
          </div>
        </div>`;
    }).join('');
  } catch {
    resultsEl.innerHTML = '<p class="search-hint">Search unavailable.</p>';
  }
}
