// SELECTORS
const hamburger = document.querySelector('.hamburger');
const bar       = document.querySelectorAll('.bar');
const navMenu   = document.querySelector('.nav-menu');
const sovaImg   = document.querySelectorAll('.valo-img, .valo-img-cropped');

let abilitiesTextHead = document.getElementById('abilities-text-head');
const abilitiesTextBody = document.getElementById('abilities-text-body');

/*===== SCROLL REVEAL =====*/
const sr = ScrollReveal({ origin: 'bottom', distance: '200px', duration: 2000 });
sr.reveal('.text-overlay',      { origin: 'center' });
sr.reveal('.valo-img-container',{ distance: '200px', reset: false });
sr.reveal('#agent-name',        {});
sr.reveal('.desc-container',    { origin: 'left' });
sr.reveal('.skill-container h1',{ origin: 'left' });
sr.reveal('.abilities-ico',     { origin: 'left' });
sr.reveal('.abilities-text',    { origin: 'left' });
sr.reveal('.other-agents h1',   { origin: 'left' });
sr.reveal('.agent',             { delay: 500 });
sr.reveal('.play-now',          {});

hamburger.addEventListener('click', mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    bar.forEach(el => el.classList.toggle('active'));
}

const navLink = document.querySelectorAll('.nav-link');
navLink.forEach(n => n.addEventListener('click', closeMenu));

if (sovaImg.length > 0) {
    sovaImg.forEach(img => {
        window.addEventListener('scroll', () => {
            let value = window.scrollY;
            img.style.top = value * -0.05 + 'vh';
            if (value > 250) img.style.top = -.50 + 'vh';
            if (value === 0)  img.style.top = 10   + 'vh';
        });
    });
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    bar.forEach(el => el.classList.remove('active'));
}

// ── Agent video map (fetched from backend) ───────────────────────────────────
let agentVideoMap  = {};
let cachedAgentData = null;

async function loadAgentVideos() {
    try {
        agentVideoMap = await fetch(`${CONFIG.API_BASE_URL}/api/agents/videos`).then(r => r.json());
    } catch (e) {
        console.warn('Could not load agent video map:', e.message);
    }
}

// ── Fetch all agents (grid) ──────────────────────────────────────────────────
async function fetchAgent() {
    const response = await fetch('https://valorant-api.com/v1/agents');
    const { data } = await response.json();
    const container = document.getElementById('agent-sel');

    data.forEach(item => {
        if (!item.isPlayableCharacter) return;

        const agentLink     = document.createElement('a');
        agentLink.href      = `agent-info.html?agentId=${item.uuid}`;
        agentLink.className = 'agent';
        agentLink.id        = item.uuid;

        const img   = document.createElement('img');
        img.src     = item.displayIconSmall;
        img.alt     = `${item.displayName} from VALORANT`;
        img.loading = 'lazy';
        agentLink.appendChild(img);

        agentLink.addEventListener('click', () => {
            agentLink.textContent = agentLink.textContent === '' ? item.uuid : '';
            if (agentLink.textContent !== '') agentData();
        });

        container.appendChild(agentLink);
    });
}
fetchAgent();

// ── Fetch single agent detail ────────────────────────────────────────────────
function getQueryParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

async function agentData() {
    const agentUuid = getQueryParameter('agentId');
    if (!agentUuid) return;

    const response      = await fetch(`https://valorant-api.com/v1/agents/${agentUuid}`);
    const { data }      = await response.json();
    cachedAgentData     = data;

    const agentName  = document.getElementById('agent-name');
    const fullIcon   = document.getElementById('fullIcon');
    const aDesc      = document.getElementById('agent-description');
    const aType      = document.querySelector('.desc-container');
    const abilitiesButtonContainer = document.querySelector('.abilities-button');
    const radioContainer           = document.querySelector('.radio-container');

    agentName.textContent = data.displayName.toUpperCase();
    agentName.style.fontSize = data.displayName.length > 5 ? '600%' : '530%';
    document.querySelector('title').textContent = `Valorant Agent - ${data.displayName}`;

    const typeIcon = document.getElementById('typeIcon');
    const icon     = document.createElement('img');
    icon.src       = data.role.displayIcon;
    icon.loading   = 'lazy';
    typeIcon.append(icon, data.role.displayName.toUpperCase());

    aDesc.textContent = data.description;
    aType.appendChild(aDesc);

    const portrait   = document.createElement('img');
    portrait.src     = data.fullPortraitV2;
    portrait.alt     = `${data.displayName}-img`;
    portrait.setAttribute('class', 'valo-img-cropped');
    portrait.id      = 'fullIcon';
    portrait.loading = 'lazy';
    fullIcon.replaceWith(portrait);

    const slots = ['Ability1', 'Ability2', 'Grenade', 'Ultimate'];
    for (let i = 0; i < 4; i++) {
        const radioInput     = document.createElement('input');
        radioInput.type      = 'radio';
        radioInput.name      = 'skill-btn';
        radioInput.className = 'radio-btn';
        radioInput.value     = i;
        radioContainer.appendChild(radioInput);

        const button     = document.createElement('button');
        button.className = 'abilities-ico';
        button.id        = i;
        button.onclick   = (idx => () => skillBtn(idx))(i);

        const btnImg = document.createElement('img');
        btnImg.src   = data.abilities.find(a => a.slot === slots[i]).displayIcon;
        btnImg.loading = 'lazy';
        button.appendChild(btnImg);
        abilitiesButtonContainer.appendChild(button);
    }
}
agentData();

// ── Show ability media (YouTube embed or search fallback) ─────────────────────
function skillBtn(n) {
    if (!cachedAgentData) return;
    const data = cachedAgentData;

    const slots   = ['Ability1', 'Ability2', 'Grenade', 'Ultimate'];
    const ability = data.abilities.find(a => a.slot === slots[n]);

    abilitiesTextHead.textContent = ability.displayName;
    abilitiesTextBody.textContent = ability.description;

    const mediaEl   = document.getElementById('abilities-media');
    const agentVids = agentVideoMap[data.displayName];
    const videoId   = agentVids?.[slots[n]];

    if (videoId) {
        mediaEl.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1"
                title="${ability.displayName}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="ability-iframe">
            </iframe>`;
    } else {
        const q = encodeURIComponent(`valorant ${data.displayName} ${ability.displayName} ability showcase`);
        mediaEl.innerHTML = `
            <div class="ability-no-video">
                <img src="${ability.displayIcon}" alt="${ability.displayName}"
                     class="ability-preview-icon" loading="lazy">
                <p class="ability-no-video-name">${ability.displayName}</p>
                <a href="https://www.youtube.com/results?search_query=${q}"
                   target="_blank" rel="noopener" class="ability-yt-link">
                    ▶ Watch on YouTube
                </a>
            </div>`;
    }
}

// Load video map only on agent detail pages
if (getQueryParameter('agentId')) {
    loadAgentVideos();
}
