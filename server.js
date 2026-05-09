const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const path     = require('path');
const fs       = require('fs');
const cheerio  = require('cheerio');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ValoWiki API running', version: '2.0.0' });
});

// ── VLR.gg proxy helper ──────────────────────────────────────────────────────
const VLR_BASE = 'https://vlrggapi.vercel.app';
async function vlrProxy(url, res, label) {
  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'ValoWiki/2.0' }
    });
    if (!upstream.ok) throw new Error(`Upstream HTTP ${upstream.status}`);
    res.json(await upstream.json());
  } catch (err) {
    console.error(`[${label}]`, err.message);
    res.status(502).json({ error: `Failed to fetch ${label}` });
  }
}

// ── v2 API routes ────────────────────────────────────────────────────────────

// GET /api/news
app.get('/api/news', (_req, res) =>
  vlrProxy(`${VLR_BASE}/v2/news`, res, 'news')
);

// GET /api/match?q=upcoming|live_score|results
app.get('/api/match', (req, res) => {
  const VALID_Q = ['upcoming', 'live_score', 'results'];
  const q = VALID_Q.includes(req.query.q) ? req.query.q : 'upcoming';
  vlrProxy(`${VLR_BASE}/v2/match?q=${q}`, res, `match/${q}`);
});

// Legacy path-param route for backwards compat
app.get('/api/match/:status', (req, res) => {
  const map = { upcoming: 'upcoming', results: 'results', live: 'live_score' };
  const q   = map[req.params.status] || 'upcoming';
  vlrProxy(`${VLR_BASE}/v2/match?q=${q}`, res, `match/${q}`);
});

// GET /api/rankings/:region
const VALID_REGIONS = ['na','eu','ap','la','la-s','la-n','oce','kr','mn','br','cn'];
app.get('/api/rankings/:region', (req, res) => {
  const { region } = req.params;
  if (!VALID_REGIONS.includes(region))
    return res.status(400).json({ error: 'Invalid region' });
  vlrProxy(`${VLR_BASE}/v2/rankings?region=${region}`, res, `rankings/${region}`);
});

// GET /api/events?q=upcoming|completed|live
app.get('/api/events', (req, res) => {
  const VALID_Q = ['upcoming', 'completed', 'live'];
  const q = VALID_Q.includes(req.query.q) ? req.query.q : 'upcoming';
  vlrProxy(`${VLR_BASE}/v2/events?q=${q}`, res, `events/${q}`);
});

// GET /api/event/:id  (event details — prize, rosters, standings)
app.get('/api/event/:id', (req, res) => {
  const id = encodeURIComponent(req.params.id);
  vlrProxy(`${VLR_BASE}/v2/event/${id}`, res, `event/${id}`);
});

// GET /api/stats?region=na&timespan=60
app.get('/api/stats', (req, res) => {
  const { region, timespan } = req.query;
  if (!VALID_REGIONS.includes(region))
    return res.status(400).json({ error: 'Invalid region' });
  const ts = ['30', '60', '90'].includes(timespan) ? timespan : '60';
  vlrProxy(`${VLR_BASE}/v2/stats?region=${region}&timespan=${ts}`, res, `stats/${region}`);
});

// GET /api/search?q=
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q param required' });
  vlrProxy(`${VLR_BASE}/v2/search?q=${encodeURIComponent(q)}`, res, 'search');
});

// GET /api/player?q=
app.get('/api/player', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q param required' });
  vlrProxy(`${VLR_BASE}/v2/player?q=${encodeURIComponent(q)}`, res, 'player');
});

// GET /api/team?q=
app.get('/api/team', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q param required' });
  vlrProxy(`${VLR_BASE}/v2/team?q=${encodeURIComponent(q)}`, res, 'team');
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

// GET /api/tierlist  (static fallback)
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

    const $ = cheerio.load(html);
    const title   = $('h1.wf-title').first().text().trim() || $('h1').first().text().trim();
    const author  = $('.article-author').first().text().trim() || $('[class*="author"]').first().text().trim();
    const date    = $('time').first().text().trim() || $('[data-time]').first().text().trim();
    const heroImg = $('meta[property="og:image"]').attr('content') || null;
    const paragraphs = [];
    $('.article-body p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) paragraphs.push(text);
    });
    res.json({ title, author, date, heroImg, paragraphs });
  } catch (err) {
    console.error('[/api/article]', err.message);
    res.status(502).json({ error: 'Failed to fetch article' });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`ValoWiki API v2 listening on port ${PORT}`));
