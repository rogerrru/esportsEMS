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
  res.json({ status: 'ValoWiki API running', version: '1.0.0' });
});

// ── VLR.gg proxy helpers ─────────────────────────────────────────────────────
async function vlrProxy(url, res, label) {
  try {
    const upstream = await fetch(url);
    if (!upstream.ok) throw new Error(`Upstream HTTP ${upstream.status}`);
    res.json(await upstream.json());
  } catch (err) {
    console.error(`[${label}]`, err.message);
    res.status(502).json({ error: `Failed to fetch ${label}` });
  }
}

// GET /api/news
app.get('/api/news', (_req, res) =>
  vlrProxy('https://vlrggapi.vercel.app/news', res, 'news')
);

// GET /api/rankings/:region
const VALID_REGIONS = ['na','eu','ap','la','la-s','la-n','oce','kr','mn','br','cn'];
app.get('/api/rankings/:region', (req, res) => {
  const { region } = req.params;
  if (!VALID_REGIONS.includes(region))
    return res.status(400).json({ error: 'Invalid region' });
  vlrProxy(`https://vlrggapi.vercel.app/rankings/${region}`, res, `rankings/${region}`);
});

// GET /api/match/:status
app.get('/api/match/:status', (req, res) => {
  const { status } = req.params;
  if (!['upcoming', 'results'].includes(status))
    return res.status(400).json({ error: 'Status must be "upcoming" or "results"' });
  vlrProxy(`https://vlrggapi.vercel.app/match/${status}`, res, `match/${status}`);
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
    if (map)  lineups = lineups.filter(l => l.map.toLowerCase()   === map.toLowerCase());
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

// GET /api/article?url=https://www.vlr.gg/...
app.get('/api/article', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url param required' });

  let targetUrl;
  try {
    targetUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (!targetUrl.hostname.endsWith('vlr.gg')) {
    return res.status(400).json({ error: 'Only vlr.gg URLs are allowed' });
  }

  try {
    const html = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });

    const $ = cheerio.load(html);

    const title  = $('h1.wf-title').first().text().trim()
                || $('h1').first().text().trim();
    const author = $('.article-author').first().text().trim()
                || $('[class*="author"]').first().text().trim();
    const date   = $('time').first().text().trim()
                || $('[data-time]').first().text().trim();
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
app.listen(PORT, () => console.log(`ValoWiki API listening on port ${PORT}`));
