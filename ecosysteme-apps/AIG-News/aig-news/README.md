# AIG News — global headlines, categorized

A real-time news aggregator pulling live RSS feeds from two outlet
collections, each with its own categorization scheme, filterable by
topic/region/source, with search. No backend — runs as a static page,
fetching feeds directly from your browser.

## Two outlet sets

Switch between them with the "Outlet set" tabs at the top of the page.

**World & Politics (15 outlets)** — BBC World News, Al Jazeera, The
Guardian, The New York Times, Reuters, The Times of India, Time Magazine,
The Atlantic, USA Today, Agence France-Presse, The Hindu, Forbes, The
Indian Express, France 24, CNN. Categorized into: Politics, Business,
Technology, Science, Health, Culture, World Affairs, Sports.

**Markets, Crypto & Innovation (9 outlets)** — NBC News, NPR, C-SPAN,
Bloomberg, The Wall Street Journal, BBC News, Reuters, Associated Press,
and Forbes (shared with the first set). Categorized into: Market Press &
Economy, War & Conflict, Future & Innovation, Money & Crypto, Feel Good
News.

## IMPORTANT — run this from a local server, not double-click it

Same constraint as the other AIG apps: browsers block cross-origin RSS
fetches from a `file://` page. Serve this folder over HTTP:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Outlet feed sources

| Outlet | Feed source |
|---|---|
| BBC World News / BBC News | direct RSS (`feeds.bbci.co.uk`) |
| Al Jazeera | direct RSS |
| The Guardian | direct RSS |
| The New York Times | direct RSS |
| Reuters | via Google News (discontinued direct RSS in 2020) |
| The Times of India | direct RSS |
| Time Magazine | direct RSS |
| The Atlantic | direct RSS |
| USA Today | direct RSS |
| Agence France-Presse | via Google News (no public consumer RSS) |
| The Hindu | direct RSS |
| Forbes | via Google News (direct feed unreliable/JS-gated) |
| The Indian Express | direct RSS |
| France 24 | direct RSS |
| CNN | direct RSS |
| NBC News | direct RSS |
| NPR | direct RSS |
| C-SPAN | via Google News (no reliable consumer RSS) |
| Bloomberg | via Google News (no public consumer RSS) |
| The Wall Street Journal | direct RSS (Dow Jones feed) |
| Associated Press | via Google News (discontinued direct RSS) |

Outlets without a reliable direct feed route through a per-site Google
News RSS search (`news.google.com/rss/search?q=allinurl:<site>`) — a
standard, legitimate workaround, not scraping; it's still RSS, just
indexed by Google rather than served by the publisher directly.

## How fetching works

Browsers can't fetch most of these feeds directly (no CORS headers), so
every request goes through a public CORS proxy (`api.allorigins.win`).
This proxy has no uptime guarantee — if headlines aren't loading, that's
the most common cause, and the app says so directly rather than failing
silently.

Every outlet is fetched **independently** (`Promise.allSettled`, not
`Promise.all`), so one feed being down, rate-limited, or having changed
its URL never blocks the other 14. The status panel ("Outlets — 15
sources", click to expand) shows exactly which outlets loaded and how
many headlines came back from each, or the specific error for any that
failed.

## Video coverage

Below the headline grid, a "Video coverage" section shows recent uploads
from outlets' **official YouTube channels**, embedded with YouTube's own
iframe player — playback, ads, and view-counting all happen on YouTube's
side, exactly as if watched there directly.

This works by fetching each channel's public RSS feed
(`https://www.youtube.com/feeds/videos.xml?channel_id=...`), which is
real, free, undocumented-but-stable YouTube infrastructure — no API key,
no scraping. Thumbnails load immediately; the actual embedded player only
loads after you click play, so the page never silently loads several
YouTube iframes (and their tracking requests) before you've asked to
watch anything.

**Only two outlets have a video source right now: BBC World News and Al
Jazeera.** This is intentional, not an oversight. A YouTube channel ID is
a permanent 24-character string, and every public channel-ID directory I
could check truncates them for display (e.g. shows `UC16niRr50-MSBwiO3YDb3RA`
as `UC16niRr50..`). Filling in a guessed or truncated ID would silently
embed the wrong channel's videos under a trusted outlet's name — a real
misinformation risk — so this app only ever ships a channel ID that's
been independently confirmed by resolving to a real
`youtube.com/channel/UC...` URL. The two included here were confirmed that
way. Every other outlet's `youtubeChannelId` is explicitly `null` in
`outlets.js`, and the app says so plainly in the video section rather than
hiding the gap.

**To add a verified outlet:**
1. Find the channel's real ID — visit their official YouTube channel,
   view page source, search for `"channelId"` or `<link rel="canonical"
   href="https://www.youtube.com/channel/UC...">`. The ID always starts
   with `UC` and is 24 characters.
2. Set `youtubeChannelId: "UC..."` on that outlet's entry in `outlets.js`.
3. That's it — `fetchOutletVideos()` and the rendering already handle any
   outlet with a non-null ID.

## Categorization

Headlines are sorted into topic tabs by real keyword matching against each
headline's actual title and description text — see `TOPIC_SCHEMES` in
`outlets.js`, which has one keyword set per outlet collection. This is
pattern-matching on words that are actually present in the headline, not
an external classifier and not a claim about how any outlet categorizes
its own coverage. A headline can land in multiple topics if it matches
multiple keyword sets.

Matching uses word-boundary regex (`\bword\b`), not plain substring
search — this matters in practice: an early version matched "war" inside
"heart**war**ming" and mis-tagged a feel-good story as War & Conflict.
Fixed and verified with that exact case as a regression test.

## Tested

- All 15 feeds loading successfully
- Partial failure (1 of 15 feeds erroring) — confirmed the other 14 still
  render correctly and the failure is reported specifically, not silently
- All 15 feeds failing (CORS proxy down) — confirmed a clear explanatory
  message rather than a blank page
- Topic, region, and source filtering, search, and both sort modes
- Switching between the two outlet sets, including category-scheme
  switching and a real categorization bug caught and fixed in the process
  (see Categorization above)
- Video loading from both verified channels, correct newest-first sort
  across outlets, click-to-embed behavior (verified the real YouTube
  iframe injects with the correct video ID only after a click, not before)
- Video section's honest "not verified yet" messaging when switching to
  the outlet set with zero verified channel IDs
- Mobile (390px touch viewport) — no horizontal overflow, outlet status
  panel and all filter rows reflow correctly

## Files

```
index.html    structure, styling, layout
outlets.js    the 23 outlet definitions (name, region, feed URL, topics,
              and verified YouTube channel ID where one exists), plus the
              two keyword-categorization schemes
app.js        feed fetching, parsing, filtering, search, video fetching
              and embedding, rendering
```

## Extending this

Add an outlet by adding one object to the `OUTLETS` array in `outlets.js`
— `id`, `name`, `region`, `siteUrl`, `feedUrl`, and `topics`. If the outlet
doesn't have a working direct RSS feed, set `viaGoogleNews: true` and
point `feedUrl` at a `news.google.com/rss/search?q=allinurl:<domain>`
query instead.
