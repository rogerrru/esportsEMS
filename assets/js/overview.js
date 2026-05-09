const newsContainer    = document.querySelector('.news-container');
const loadMoreContainer = document.querySelector('.load-more-container');

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #0f1923 0%, #ff4655 100%)',
  'linear-gradient(135deg, #12101a 0%, #7b2fff 100%)',
  'linear-gradient(135deg, #0a1520 0%, #4cc9f0 100%)',
  'linear-gradient(135deg, #0f1923 0%, #f9c74f 100%)',
  'linear-gradient(135deg, #1a0a0a 0%, #ff8c42 100%)',
  'linear-gradient(135deg, #0a180a 0%, #39b54a 100%)',
];

let allNewsData = [];
let startIndex  = 0;
const itemsPerPage = 6;

// ── News feed ────────────────────────────────────────────────────────────────
function fetchNews() {
  fetch(`${CONFIG.API_BASE_URL}/api/news`)
    .then(r => r.json())
    .then(fetched => {
      allNewsData = fetched;
      if (!fetched?.data?.segments) {
        console.error('Unexpected news shape:', fetched);
        return;
      }

      const segments = fetched.data.segments.slice(startIndex, startIndex + itemsPerPage);

      segments.forEach((news, index) => {
        const href = news.url_path.startsWith('http')
          ? news.url_path
          : `https://www.vlr.gg${news.url_path}`;

        const hasImg   = news.img && !news.img.includes('error') && !news.img.includes('null');
        const gradient = FALLBACK_GRADIENTS[(startIndex + index) % FALLBACK_GRADIENTS.length];

        const imageContent = hasImg
          ? `<img src="${news.img}" alt="${news.title}" loading="lazy">`
          : `<div class="news-image-placeholder" style="background:${gradient};">
               <span class="news-image-label">VLR.GG</span>
             </div>`;

        const newsItem = document.createElement('div');
        newsItem.classList.add('indie-news-container');
        newsItem.innerHTML = `
          <a class="news-item" href="${href}" target="_blank">
            <div class="news-image">
              ${imageContent}
              <div class="news-image-overlay">
                <span class="news-overlay-date">${news.date}</span>
                <h2 class="news-overlay-title">${news.title}</h2>
              </div>
            </div>
            <div class="news-details">
              <div class="news-content"><span>${news.description}</span></div>
              <div class="read-more"><h3>READ MORE</h3></div>
            </div>
          </a>`;

        // Intercept click → internal article view via hash router
        newsItem.querySelector('.news-item').addEventListener('click', e => {
          e.preventDefault();
          window.location.hash = `article?url=${encodeURIComponent(href)}`;
        });

        newsContainer.appendChild(newsItem);
      });

      startIndex += itemsPerPage;
      const btn = document.querySelector('.load-more-button');
      btn.style.display = startIndex < allNewsData.data.segments.length ? 'block' : 'none';
    })
    .catch(err => console.error('News fetch error:', err));
}

const loadMoreButton = document.createElement('button');
loadMoreButton.classList.add('load-more-button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.style.display = 'none';
loadMoreButton.addEventListener('click', fetchNews);
loadMoreContainer.appendChild(loadMoreButton);

// ── Article detail loader ────────────────────────────────────────────────────
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

    const heroHtml = data.heroImg
      ? `<img src="${data.heroImg}" alt="" class="article-hero-img" loading="lazy">`
      : '';

    const contentHtml = (data.paragraphs || []).length
      ? data.paragraphs.map(p => `<p class="article-detail-p">${p}</p>`).join('')
      : `<p class="article-no-content">Full content unavailable inline.
           <a href="${url}" target="_blank">Read the full article on VLR.gg ↗</a></p>`;

    bodyEl.innerHTML = `
      ${heroHtml}
      <h1 class="article-detail-title">${data.title || 'Article'}</h1>
      ${data.author ? `<p class="article-detail-author">${data.author}</p>` : ''}
      ${data.date   ? `<p class="article-detail-date">${data.date}</p>`   : ''}
      <div class="article-detail-body">${contentHtml}</div>`;
  } catch {
    loadingEl.hidden = true;
    bodyEl.innerHTML = `<p class="article-error">Could not load article.
      <a href="${url}" target="_blank">Open on VLR.gg ↗</a></p>`;
  }
}

// ── Hash router ──────────────────────────────────────────────────────────────
function handleRoute() {
  const hash      = window.location.hash;
  const articleEl = document.getElementById('article-view');

  if (hash.startsWith('#article?')) {
    const url = new URLSearchParams(hash.slice('#article?'.length)).get('url');
    newsContainer.style.display     = 'none';
    loadMoreContainer.style.display = 'none';
    articleEl.hidden = false;
    window.scrollTo(0, 0);
    if (url) loadArticle(url);
  } else {
    newsContainer.style.display     = '';
    loadMoreContainer.style.display = '';
    articleEl.hidden = true;
  }
}

document.getElementById('article-back-btn').addEventListener('click', () => {
  history.back();
});

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', () => { fetchNews(); handleRoute(); });

function changeBackgroundImage(color) {
  document.body.style.backgroundColor = color;
  document.body.style.backgroundImage = 'none';
}
changeBackgroundImage('#0f1519');
