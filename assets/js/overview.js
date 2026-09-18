const newsContainer     = document.querySelector('.news-container');
const loadMoreContainer = document.querySelector('.load-more-container');

// Scraped text goes into innerHTML below, so escape it first.
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);

const ARROW_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5"/></svg>`;

// Keyword-based category detection
const CATEGORIES = {
  esports:   /tournament|match|league|vct|cup|champion|qualifier|team|vs\.|upset|grand final/i,
  transfers: /transfer|join|sign|leave|roster|pickup|release|acquire|announce/i,
  patches:   /patch|update|hotfix|buff|nerf|change|changelog|fix|balance/i,
};

function detectCategory(title, desc) {
  const text = `${title} ${desc}`;
  for (const [cat, rx] of Object.entries(CATEGORIES)) {
    if (rx.test(text)) return cat;
  }
  return 'esports'; // default
}

let allNewsData  = [];
let renderedItems= []; // { el, category }
let startIndex   = 0;
// First page = 1 featured story + 2 full rows of 3, so the grid ends flush.
const FIRST_PAGE_SIZE = 7;
const PAGE_SIZE       = 6;
let activeFilter = 'all';

// ── Loading / error message inside the grid ───────────────────────────────
function setStatus(text) {
  let el = newsContainer.querySelector('.news-status');
  if (!text) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('p');
    el.className = 'news-status';
    newsContainer.appendChild(el);
  }
  el.textContent = text;
}

// ── Build the filter chip bar ─────────────────────────────────────────────
function buildFilterBar() {
  const bar = document.getElementById('news-filter-bar');
  if (!bar) return;
  const chips = [
    { key: 'all',       label: 'ALL' },
    { key: 'esports',   label: 'ESPORTS' },
    { key: 'transfers', label: 'TRANSFERS' },
    { key: 'patches',   label: 'PATCHES' },
  ];
  chips.forEach(({ key, label }) => {
    const btn = document.createElement('button');
    btn.className   = `filter-chip${key === 'all' ? ' active' : ''}`;
    btn.textContent = label;
    btn.dataset.filter = key;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = key;
      applyFilter();
    });
    bar.appendChild(btn);
  });
}

function applyFilter() {
  renderedItems.forEach(({ el, category }) => {
    const visible = activeFilter === 'all' || category === activeFilter;
    el.style.display = visible ? '' : 'none';
    el.classList.toggle('hidden-item', !visible);
  });
}

// ── Render news items ─────────────────────────────────────────────────────
function fetchNews() {
  if (startIndex === 0) setStatus('Loading latest news…');

  fetch(`${CONFIG.API_BASE_URL}/api/news`)
    .then(r => r.json())
    .then(fetched => {
      allNewsData = fetched;
      if (!fetched?.data?.segments) {
        console.error('Unexpected news shape:', fetched);
        setStatus('Couldn’t load the news right now. Please try again in a moment.');
        return;
      }
      setStatus(null);

      if (!fetched.data.segments.length) {
        setStatus('No news to show right now.');
        return;
      }

      const pageSize = startIndex === 0 ? FIRST_PAGE_SIZE : PAGE_SIZE;
      const segments = fetched.data.segments.slice(startIndex, startIndex + pageSize);

      segments.forEach((news, idx) => {
        const isFirst = startIndex === 0 && idx === 0;

        const href = news.url_path.startsWith('http')
          ? news.url_path
          : `https://www.vlr.gg${news.url_path}`;

        const category = detectCategory(news.title, news.description || '');

        const wrapper = document.createElement('div');
        wrapper.classList.add('indie-news-container');
        if (isFirst) wrapper.classList.add('news-featured');
        wrapper.dataset.category = category;

        wrapper.innerHTML = `
          <a class="news-item" href="${esc(href)}" target="_blank" rel="noopener">
            <div class="news-top">
              ${isFirst ? '<span class="news-badge">Latest</span>' : ''}
              <span class="news-tag">${esc(category)}</span>
              <span class="news-date">${esc(news.date)}</span>
            </div>
            <h2 class="news-title">${esc(news.title)}</h2>
            ${news.description ? `<p class="news-desc">${esc(news.description)}</p>` : ''}
            <div class="news-foot">
              <span class="news-author">${news.author ? `By <b>${esc(news.author)}</b>` : ''}</span>
              <span class="news-cta">${isFirst ? 'Read story' : 'Read'} ${ARROW_SVG}</span>
            </div>
          </a>`;

        wrapper.querySelector('.news-item').addEventListener('click', e => {
          e.preventDefault();
          window.location.hash = `article?url=${encodeURIComponent(href)}`;
        });

        newsContainer.appendChild(wrapper);
        renderedItems.push({ el: wrapper, category });
      });

      startIndex += pageSize;

      const btn = document.querySelector('.load-more-button');
      btn.style.display = startIndex < allNewsData.data.segments.length ? 'block' : 'none';

      applyFilter();
    })
    .catch(err => {
      console.error('News fetch error:', err);
      if (!renderedItems.length) setStatus('Couldn’t load the news right now. Please try again in a moment.');
    });
}

const loadMoreButton = document.createElement('button');
loadMoreButton.classList.add('load-more-button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.style.display = 'none';
loadMoreButton.addEventListener('click', fetchNews);
loadMoreContainer.appendChild(loadMoreButton);

// ── Article detail loader ──────────────────────────────────────────────────
async function loadArticle(url) {
  const loadingEl  = document.getElementById('article-loading');
  const bodyEl     = document.getElementById('article-body');
  const sourceLink = document.getElementById('article-source-link');

  sourceLink.href  = url;
  loadingEl.hidden = false;
  bodyEl.innerHTML = '';

  try {
    const data = await fetch(
      `${CONFIG.API_BASE_URL}/api/article?url=${encodeURIComponent(url)}`
    ).then(r => r.json());

    loadingEl.hidden = true;

    const heroHtml = /^https?:\/\//.test(data.heroImg || '')
      ? `<img src="${esc(data.heroImg)}" alt="" class="article-hero-img" loading="lazy">`
      : '';

    const contentHtml = (data.paragraphs || []).length
      ? data.paragraphs.map(p => `<p class="article-detail-p">${esc(p)}</p>`).join('')
      : `<p class="article-no-content">Full content unavailable inline.
           <a href="${esc(url)}" target="_blank" rel="noopener">Read on VLR.gg ↗</a></p>`;

    const metaHtml = data.author || data.date
      ? `<div class="article-detail-meta">
           ${data.author ? `<span class="article-detail-author">${esc(data.author)}</span>` : ''}
           ${data.date   ? `<span class="article-detail-date">${esc(data.date)}</span>`     : ''}
         </div>`
      : '';

    bodyEl.innerHTML = `
      ${heroHtml}
      <h1 class="article-detail-title">${esc(data.title || 'Article')}</h1>
      ${metaHtml}
      <div class="article-detail-body">${contentHtml}</div>`;
  } catch {
    loadingEl.hidden = true;
    bodyEl.innerHTML = `<p class="article-error">Could not load article.
      <a href="${esc(url)}" target="_blank" rel="noopener">Open on VLR.gg ↗</a></p>`;
  }
}

// ── Hash router ────────────────────────────────────────────────────────────
function handleRoute() {
  const hash      = window.location.hash;
  const articleEl = document.getElementById('article-view');
  const filterBar = document.getElementById('news-filter-bar');

  if (hash.startsWith('#article?')) {
    const url = new URLSearchParams(hash.slice('#article?'.length)).get('url');
    newsContainer.style.display     = 'none';
    loadMoreContainer.style.display = 'none';
    if (filterBar) filterBar.style.display = 'none';
    articleEl.hidden = false;
    window.scrollTo(0, 0);
    if (url) loadArticle(url);
  } else {
    newsContainer.style.display     = '';
    loadMoreContainer.style.display = '';
    if (filterBar) filterBar.style.display = '';
    articleEl.hidden = true;
  }
}

document.getElementById('article-back-btn').addEventListener('click', () => history.back());
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', () => { buildFilterBar(); fetchNews(); handleRoute(); });
