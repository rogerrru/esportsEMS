const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const path     = require('path');
const fs       = require('fs');
const cheerio  = require('cheerio');

const app      = express();
const PORT     = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_API_KEY || '';

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ValoWiki API running', version: '3.0.0' });
});

// ── VLR.gg scraping infrastructure ──────────────────────────────────────────
const SCRAPE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
};

const _cache = {};
function getCache(key, ttlMs) {
  const e = _cache[key];
  return e && Date.now() - e.ts < ttlMs ? e.data : null;
}
function setCache(key, data) { _cache[key] = { data, ts: Date.now() }; }

async function fetchHtml(url) {
  const r = await fetch(url, { headers: SCRAPE_HEADERS });
  if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
  return r.text();
}

// ── News ─────────────────────────────────────────────────────────────────────
// Scrapes https://www.vlr.gg/news
app.get('/api/news', async (_req, res) => {
  const cached = getCache('news', 5 * 60_000);
  if (cached) return res.json(cached);
  try {
    const html = await fetchHtml('https://www.vlr.gg/news');
    const $    = cheerio.load(html);
    const segments = [];
    $('a.wf-module-item').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.match(/^\/\d+\//)) return;
      // Markup: <a><div><div>title</div><div>description</div><div.ge-text-light>flag • date • by author</div></div></a>
      const body    = $(el).children('div').first();
      const nonMeta = body.children('div').not('.ge-text-light');
      const clean   = s => s.replace(/\s+/g, ' ').trim();
      const title   = clean(nonMeta.eq(0).text());
      const desc    = clean(nonMeta.eq(1).text());
      const metaParts = clean(body.find('.ge-text-light').first().text())
        .split('•').map(s => s.trim()).filter(Boolean);
      const byPart  = metaParts.find(p => /^by\s/i.test(p)) || '';
      const date    = metaParts.find(p => !/^by\s/i.test(p)) || '';
      const author  = byPart.replace(/^by\s+/i, '');
      if (title) segments.push({ title, description: desc, date, author, url_path: href, img: null });
    });
    const result = { data: { segments } };
    setCache('news', result);
    res.json(result);
  } catch (err) {
    console.error('[/api/news]', err.message);
    res.status(502).json({ error: 'Failed to fetch news' });
  }
});

// ── Matches ──────────────────────────────────────────────────────────────────
// Scrapes https://www.vlr.gg/matches (upcoming/live) or /matches/results
function parseMatches($) {
  const matches = [];
  $('a.match-item').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (!href.match(/^\/\d+\//)) return;

    // Team names — exclude .match-item-event children
    const teamEls = $(el).find('.text-of').filter((_, t) =>
      !$(t).closest('.match-item-event').length
    );
    const team1 = $(teamEls[0]).text().trim();
    const team2 = $(teamEls[1]).text().trim();

    const scoreEls = $(el).find('.match-item-vs-team-score');
    const raw1     = $(scoreEls[0]).text().trim();
    const raw2     = $(scoreEls[1]).text().trim();
    const score1   = raw1 === '–' || raw1 === '' ? null : raw1;
    const score2   = raw2 === '–' || raw2 === '' ? null : raw2;

    const status = $(el).find('.ml-status').text().trim();
    const eta    = $(el).find('.ml-eta').text().trim();

    const tournEl        = $(el).find('.match-item-event');
    const tournament_name = tournEl.clone()
      .find('.match-item-event-series').remove().end()
      .text().replace(/\s+/g, ' ').trim();
    const round_info = tournEl.find('.match-item-event-series')
      .text().replace(/\s+/g, ' ').trim();

    if (team1 && team2) {
      matches.push({ team1, team2, score1, score2, status, time_until_match: eta,
        tournament_name, round_info, url: href });
    }
  });
  return matches;
}

app.get('/api/match', async (req, res) => {
  const VALID = ['upcoming', 'live_score', 'results'];
  const q     = VALID.includes(req.query.q) ? req.query.q : 'upcoming';
  const cached = getCache(`match_${q}`, 2 * 60_000);
  if (cached) return res.json(cached);
  try {
    const url  = q === 'results'
      ? 'https://www.vlr.gg/matches/results'
      : 'https://www.vlr.gg/matches';
    const $    = cheerio.load(await fetchHtml(url));
    let segments = parseMatches($);
    if (q === 'live_score') {
      const live = segments.filter(m => /live/i.test(m.status));
      segments = live.length ? live : segments;
    }
    const result = { data: { segments } };
    setCache(`match_${q}`, result);
    res.json(result);
  } catch (err) {
    console.error(`[/api/match/${q}]`, err.message);
    res.status(502).json({ error: 'Failed to fetch matches' });
  }
});

// Legacy path-param route
app.get('/api/match/:status', (req, res) => {
  const map = { upcoming: 'upcoming', results: 'results', live: 'live_score' };
  res.redirect(`/api/match?q=${map[req.params.status] || 'upcoming'}`);
});

// ── Team Rankings ─────────────────────────────────────────────────────────────
// Scrapes https://www.vlr.gg/rankings/{region}
const VALID_REGIONS = ['na','eu','ap','la','la-s','la-n','oce','kr','mn','br','cn','latam'];
const VLR_REGION   = {
  'na':'na', 'eu':'eu', 'ap':'ap', 'kr':'kr',
  'la':'la-s', 'la-s':'la-s', 'la-n':'la-n', 'latam':'la-s',
  'br':'br', 'oce':'oce', 'mn':'mn', 'cn':'cn',
};

app.get('/api/rankings/:region', async (req, res) => {
  const { region } = req.params;
  if (!VALID_REGIONS.includes(region))
    return res.status(400).json({ error: 'Invalid region' });
  const vlrRegion = VLR_REGION[region] || region;
  const cached    = getCache(`rankings_${vlrRegion}`, 30 * 60_000);
  if (cached) return res.json(cached);
  try {
    const html = await fetchHtml(`https://www.vlr.gg/rankings/${vlrRegion}`);
    const $    = cheerio.load(html);
    const teams = [];
    $('tr').each((_, row) => {
      const rank     = $(row).find('td.rank-item-rank').text().trim();
      if (!rank || isNaN(rank)) return;
      const teamCell = $(row).find('td.rank-item-team');
      const logo     = teamCell.find('img').first().attr('src') || null;
      const teamDiv  = teamCell.find('a > div').first();
      const team     = teamDiv.clone().find('.rank-item-team-country').remove()
        .end().text().trim() || teamCell.text().trim();
      const country  = teamDiv.find('.rank-item-team-country').text().trim();
      const rating   = $(row).find('td.rank-item-rating').text().replace(/\s+/g,'').trim();
      if (team) teams.push({
        rank, team, country, earnings: rating, record: '',
        logo: logo ? (logo.startsWith('//') ? `https:${logo}` : logo) : null,
      });
    });
    const result = { data: teams };
    setCache(`rankings_${vlrRegion}`, result);
    res.json(result);
  } catch (err) {
    console.error('[/api/rankings]', err.message);
    res.status(502).json({ error: 'Failed to fetch rankings' });
  }
});

// ── Events ────────────────────────────────────────────────────────────────────
// Scrapes https://www.vlr.gg/events (and ?completed=1 for past events)
const STATUS_CLASS = { 'mod-ongoing': 'live', 'mod-upcoming': 'upcoming', 'mod-completed': 'completed' };

function parseEvents($) {
  const events = [];
  $('a.event-item').each((_, el) => {
    const href  = $(el).attr('href') || '';
    const title = $(el).find('.event-item-title').text().trim();
    if (!title || !href.startsWith('/event/')) return;
    const statusEl  = $(el).find('.event-item-desc-item-status');
    const statusCls = (statusEl.attr('class') || '').split(' ').find(c => STATUS_CLASS[c]);
    const status    = STATUS_CLASS[statusCls] || statusEl.text().trim().toLowerCase() || 'upcoming';
    const prize = $(el).find('.event-item-desc-item.mod-prize')
      .clone().find('.event-item-desc-item-label').remove().end().text().trim();
    const dates = $(el).find('.event-item-desc-item.mod-dates')
      .clone().find('.event-item-desc-item-label').remove().end().text().trim();
    let img = $(el).find('img').first().attr('src') || null;
    if (img && img.startsWith('//')) img = `https:${img}`;   // protocol-relative breaks on file:// and http://localhost
    events.push({ title, status, prizepool: prize || '', dates: dates || '', img, url: href });
  });
  return events;
}

app.get('/api/events', async (req, res) => {
  const VALID = ['upcoming', 'live', 'completed'];
  const q     = VALID.includes(req.query.q) ? req.query.q : 'upcoming';
  const cached = getCache(`events_${q}`, 10 * 60_000);
  if (cached) return res.json(cached);
  try {
    const url  = q === 'completed'
      ? 'https://www.vlr.gg/events?completed=1'
      : 'https://www.vlr.gg/events';
    const $    = cheerio.load(await fetchHtml(url));
    const all  = parseEvents($);
    const statusFilter = q === 'live' ? 'live' : q;
    const filtered = all.filter(e => e.status === statusFilter);
    const result = { data: { segments: filtered.length ? filtered : all } };
    setCache(`events_${q}`, result);
    res.json(result);
  } catch (err) {
    console.error(`[/api/events/${q}]`, err.message);
    res.status(502).json({ error: 'Failed to fetch events' });
  }
});

// ── Stats / Search / Player / Team (vlrggapi-dependent, non-critical) ─────────
// These routes are non-functional while vlrggapi.vercel.app is down (402).
// They are kept as stubs so the server doesn't crash on unexpected calls.
['get /api/stats', 'get /api/search', 'get /api/player', 'get /api/team',
 'get /api/event/:id'].forEach(route => {
  const [method, path] = route.split(' ');
  app[method](path, (_req, res) =>
    res.status(503).json({ error: 'This endpoint is temporarily unavailable' })
  );
});

// ── Riot Games API (VALORANT) ────────────────────────────────────────────────

const VAL_PLATFORM = {
  'na': 'na', 'eu': 'eu', 'ap': 'ap', 'kr': 'kr',
  'latam': 'latam', 'la': 'latam', 'la-s': 'latam', 'la-n': 'latam',
  'br': 'br', 'oce': 'ap', 'mn': 'ap', 'cn': 'ap'
};

// Cache the active act UUID for 6 hours to avoid hammering val-content
let _actId = null, _actTs = 0;
async function getActiveActId() {
  if (_actId && Date.now() - _actTs < 6 * 3600_000) return _actId;
  const r = await fetch('https://na.api.riotgames.com/val/content/v1/contents?locale=en-US', {
    headers: { 'X-Riot-Token': RIOT_KEY }
  });
  if (!r.ok) throw new Error(`val-content HTTP ${r.status}`);
  const { acts } = await r.json();
  const active   = acts.find(a => a.isActive && a.type === 'act');
  if (!active) throw new Error('No active act found');
  _actId = active.id;
  _actTs = Date.now();
  return _actId;
}

// GET /api/val/leaderboard/:region?size=200&startIndex=0
app.get('/api/val/leaderboard/:region', async (req, res) => {
  if (!RIOT_KEY) return res.status(500).json({ error: 'RIOT_API_KEY not configured on server' });
  const platform = VAL_PLATFORM[req.params.region];
  if (!platform)  return res.status(400).json({ error: 'Invalid region' });
  const size       = Math.min(parseInt(req.query.size)       || 200, 200);
  const startIndex = Math.max(parseInt(req.query.startIndex) || 0,   0);
  try {
    const actId = await getActiveActId();
    const r     = await fetch(
      `https://${platform}.api.riotgames.com/val/ranked/v1/leaderboards/by-act/${actId}?size=${size}&startIndex=${startIndex}`,
      { headers: { 'X-Riot-Token': RIOT_KEY } }
    );
    if (!r.ok) throw new Error(`Riot ranked HTTP ${r.status}`);
    res.json(await r.json());
  } catch (err) {
    console.error('[val/leaderboard]', err.message);
    res.status(502).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ── Static data endpoints ────────────────────────────────────────────────────
function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8'));
}

// GET /api/lineups  ?map=Ascent  &agent=Viper  &side=attack
app.get('/api/lineups', (req, res) => {
  try {
    let { lineups } = loadJSON('lineups.json');
    const { map, agent, side } = req.query;
    if (map)   lineups = lineups.filter(l => l.map.toLowerCase()   === map.toLowerCase());
    if (agent) lineups = lineups.filter(l => l.agent.toLowerCase() === agent.toLowerCase());
    if (side && side !== 'all') lineups = lineups.filter(l => l.side === side || l.side === 'both');
    res.json({ lineups });
  } catch (err) {
    console.error('[/api/lineups]', err.message);
    res.status(500).json({ error: 'Failed to load lineups' });
  }
});

// GET /api/tierlist
app.get('/api/tierlist', (_req, res) => {
  try {
    res.json(loadJSON('tier-list.json'));
  } catch (err) {
    console.error('[/api/tierlist]', err.message);
    res.status(500).json({ error: 'Failed to load tier list' });
  }
});

// GET /api/agents/videos
app.get('/api/agents/videos', (_req, res) => {
  try {
    res.json(loadJSON('agent-videos.json'));
  } catch (err) {
    console.error('[/api/agents/videos]', err.message);
    res.status(500).json({ error: 'Failed to load agent videos' });
  }
});

// ── Article scraper ──────────────────────────────────────────────────────────
// GET /api/article?url=https://www.vlr.gg/...
app.get('/api/article', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url param required' });
  let targetUrl;
  try { targetUrl = new URL(url); } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (!targetUrl.hostname.endsWith('vlr.gg'))
    return res.status(400).json({ error: 'Only vlr.gg URLs are allowed' });
  try {
    const html = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });
    const $     = cheerio.load(html);
    const title = $('h1.wf-title').first().text().trim() || $('h1').first().text().trim();
    const author  = $('.article-author').first().text().trim() || $('[class*="author"]').first().text().trim();
    const date    = $('time').first().text().trim() || $('[data-time]').first().text().trim();
    const heroImg = $('meta[property="og:image"]').attr('content') || null;
    const paragraphs = [];
    $('.article-body p').each((_, el) => {
      // Inline team/player mentions embed a hover card (roster, rank…) — drop it
      const clone = $(el).clone();
      clone.find('.wf-hover-card').remove();
      const text = clone.text().replace(/\s+/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')      // "FOKUS , KPI" → "FOKUS, KPI" (gap left by the removed card)
        .replace(/\s+(['’]s\b)/g, '$1')       // "Liquid 's" → "Liquid's"
        .trim();
      if (text.length > 20) paragraphs.push(text);
    });
    res.json({ title, author, date, heroImg, paragraphs });
  } catch (err) {
    console.error('[/api/article]', err.message);
    res.status(502).json({ error: 'Failed to fetch article' });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`ValoWiki API v3 listening on port ${PORT}`));
