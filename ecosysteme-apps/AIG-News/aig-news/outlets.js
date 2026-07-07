// ============================================================
// AIG News — outlet registry.
//
// Each outlet's `feedUrl` is its real public RSS feed (verified against
// each publisher's own RSS directory pages where one exists). Two outlets
// — Forbes and AFP — don't publish a reliable public RSS endpoint, so
// their entries route through Google News' per-site RSS search instead,
// which is the standard workaround for sites without direct feeds. Same
// for Reuters, which discontinued direct RSS in 2020.
//
// `categoryHints` are keyword lists used only to auto-sort each outlet's
// own headlines into the topic tabs (Politics, Science, Business, etc.) —
// this is keyword categorization of real headline text, not a claim about
// editorial stance.
// ============================================================

const OUTLETS = [
  {
    id: "bbc",
    name: "BBC World News",
    region: "Global / UK",
    siteUrl: "https://www.bbc.com/news/world",
    feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    topics: ["Politics", "Science", "Culture", "World Affairs"],
    set: "world",
    youtubeChannelId: "UC16niRr50-MSBwiO3YDb3RA" // verified: youtube.com/channel/UC16niRr50-MSBwiO3YDb3RA
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    region: "Middle East / Global",
    siteUrl: "https://www.aljazeera.com/",
    feedUrl: "https://www.aljazeera.com/xml/rss/all.xml",
    topics: ["Global Politics", "Human Rights", "Middle East"],
    set: "world",
    youtubeChannelId: "UCNye-wNBqNL5ZzHSJj3l8Bg" // verified: youtube.com/channel/UCNye-wNBqNL5ZzHSJj3l8Bg
  },
  {
    id: "guardian",
    name: "The Guardian",
    region: "UK / Europe",
    siteUrl: "https://www.theguardian.com/international",
    feedUrl: "https://www.theguardian.com/world/rss",
    topics: ["Climate", "Politics", "Society", "Technology"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "nytimes",
    name: "The New York Times",
    region: "US / International",
    siteUrl: "https://www.nytimes.com/international/",
    feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    topics: ["Politics", "Business", "Technology", "Culture"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "reuters",
    name: "Reuters",
    region: "Global (90+ countries)",
    siteUrl: "https://www.reuters.com/",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["Breaking News", "Finance", "Politics", "Health"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "toi",
    name: "The Times of India",
    region: "India / South Asia",
    siteUrl: "https://timesofindia.indiatimes.com/",
    feedUrl: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    topics: ["South Asia", "Geopolitics", "Lifestyle", "Business"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "time",
    name: "Time Magazine",
    region: "US / Global",
    siteUrl: "https://time.com/",
    feedUrl: "https://time.com/feed/",
    topics: ["Politics", "Science", "Business", "Culture"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "atlantic",
    name: "The Atlantic",
    region: "US / Global",
    siteUrl: "https://www.theatlantic.com/",
    feedUrl: "https://www.theatlantic.com/feed/all/",
    topics: ["Politics", "Culture", "Global Affairs", "Ideas"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "usatoday",
    name: "USA Today",
    region: "US / North America",
    siteUrl: "https://www.usatoday.com/",
    feedUrl: "https://rssfeeds.usatoday.com/usatoday-newstopstories",
    topics: ["National/Global News", "Lifestyle", "Sports"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "afp",
    name: "Agence France-Presse",
    region: "Global / Francophone",
    siteUrl: "https://www.afp.com/en",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:afp.com&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["World News", "Politics", "Fact-Checking"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "hindu",
    name: "The Hindu",
    region: "India",
    siteUrl: "https://www.thehindu.com/",
    feedUrl: "https://www.thehindu.com/news/international/feeder/default.rss",
    topics: ["Politics", "Economy", "International Affairs"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "forbes",
    name: "Forbes",
    region: "US / Global Business",
    siteUrl: "https://www.forbes.com/",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:forbes.com&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["Finance", "Entrepreneurship", "Technology"],
    set: "both",
    youtubeChannelId: null
  },
  {
    id: "indianexpress",
    name: "The Indian Express",
    region: "India",
    siteUrl: "https://indianexpress.com/",
    feedUrl: "https://indianexpress.com/section/world/feed/",
    topics: ["Politics", "Investigative Journalism", "World"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "france24",
    name: "France 24",
    region: "Europe / Francophone Africa",
    siteUrl: "https://www.france24.com/en/",
    feedUrl: "https://www.france24.com/en/rss",
    topics: ["International Politics", "Business", "Culture"],
    set: "world",
    youtubeChannelId: null
  },
  {
    id: "cnn",
    name: "CNN",
    region: "US / Global",
    siteUrl: "https://www.cnn.com/",
    feedUrl: "http://rss.cnn.com/rss/edition_world.rss",
    topics: ["Breaking News", "Politics", "World Events"],
    set: "world",
    youtubeChannelId: null
  },

  // ---------------- Second outlet set: business / markets / innovation ----------------
  {
    id: "nbc",
    name: "NBC News",
    region: "US / Global",
    siteUrl: "https://www.nbcnews.com/",
    feedUrl: "https://feeds.nbcnews.com/feeds/topstories",
    topics: ["Breaking News", "Politics", "Business"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "npr",
    name: "NPR",
    region: "US / Global",
    siteUrl: "https://www.npr.org/",
    feedUrl: "https://feeds.npr.org/1001/rss.xml",
    topics: ["Politics", "Business", "Science", "Culture"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "cspan",
    name: "C-SPAN",
    region: "US",
    siteUrl: "https://www.c-span.org/",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:c-span.org&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["US Politics", "Government", "Policy"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    region: "Global Business",
    siteUrl: "https://www.bloomberg.com/",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:bloomberg.com&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["Markets", "Finance", "Business", "Economy"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "wsj",
    name: "The Wall Street Journal",
    region: "US / Global Business",
    siteUrl: "https://www.wsj.com/",
    feedUrl: "https://feeds.content.dowjones.io/public/rss/RSSWorldNews",
    topics: ["Markets", "Finance", "Business", "Politics"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "bbc2",
    name: "BBC News",
    region: "Global / UK",
    siteUrl: "https://www.bbc.com/news",
    feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
    topics: ["Politics", "Business", "Technology", "World"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "reuters2",
    name: "Reuters",
    region: "Global (90+ countries)",
    siteUrl: "https://www.reuters.com/",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["Breaking News", "Finance", "Markets"],
    set: "money",
    youtubeChannelId: null
  },
  {
    id: "ap",
    name: "Associated Press",
    region: "Global",
    siteUrl: "https://www.apnews.com/",
    feedUrl: "https://news.google.com/rss/search?q=when:24h+allinurl:apnews.com&hl=en-US&gl=US&ceid=US:en",
    viaGoogleNews: true,
    topics: ["Breaking News", "Politics", "World"],
    set: "money",
    youtubeChannelId: null
  }
];

// ============================================================
// Two separate topic schemes, one per outlet set. "world" is the
// original general-news scheme; "money" is the markets/innovation/
// human-interest scheme requested for the second outlet group.
// Both are keyword-matched against real headline/description text.
// ============================================================
const TOPIC_SCHEMES = {
  world: {
    Politics: ["election", "president", "government", "minister", "parliament", "senate", "congress", "policy", "vote", "campaign", "diplomat", "sanction", "treaty", "coalition", "lawmaker", "presidential", "prime minister"],
    Business: ["market", "economy", "trade", "stock", "bank", "inflation", "merger", "ipo", "earnings", "tariff", "investor", "startup", "ceo", "corporate", "economic"],
    Technology: ["ai", "artificial intelligence", "tech", "software", "app", "chip", "cyber", "robot", "data", "internet", "startup", "algorithm", "smartphone"],
    Science: ["study", "research", "scientist", "space", "nasa", "climate", "discovery", "vaccine", "physics", "biology", "experiment", "telescope"],
    Health: ["health", "disease", "hospital", "vaccine", "outbreak", "who", "medical", "pandemic", "drug", "mental health"],
    Culture: ["film", "music", "art", "festival", "celebrity", "book", "museum", "award", "entertainment", "culture"],
    "World Affairs": ["war", "conflict", "military", "border", "ceasefire", "refugee", "united nations", "peace talks", "invasion", "attack", "crisis"],
    Sports: ["match", "tournament", "championship", "olympic", "league", "coach", "athlete", "world cup"]
  },
  money: {
    "Market Press & Economy": ["market", "stock", "economy", "economic", "inflation", "gdp", "earnings", "trade", "tariff", "federal reserve", "interest rate", "recession", "ipo", "nasdaq", "dow jones", "s&p", "treasury", "unemployment"],
    "War & Conflict": ["war", "conflict", "military", "strike", "ceasefire", "invasion", "attack", "troops", "missile", "border clash", "militant", "airstrike", "combat", "sanctions"],
    "Future & Innovation": ["ai", "artificial intelligence", "innovation", "breakthrough", "robot", "space", "research", "technology", "patent", "quantum", "biotech", "startup", "invention"],
    "Money & Crypto": ["crypto", "bitcoin", "ethereum", "blockchain", "token", "stablecoin", "defi", "nft", "digital currency", "coinbase", "wallet"],
    "Feel Good News": ["rescue", "celebrat", "kindness", "community", "recover", "reunite", "donat", "volunteer", "inspir", "heartwarming", "hero", "overcome", "triumph", "uplift"]
  }
};

function categorize(text, scheme) {
  const lower = (text || "").toLowerCase();
  const keywords = TOPIC_SCHEMES[scheme || "world"];
  const matches = [];
  for (const [topic, words] of Object.entries(keywords)) {
    const hit = words.some(w => {
      // Word-boundary match for normal words; phrases with spaces (e.g.
      // "border clash") just use substring matching since \b doesn't
      // apply cleanly across multi-word phrases anyway.
      if (w.includes(" ")) return lower.includes(w);
      const re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
      return re.test(lower);
    });
    if (hit) matches.push(topic);
  }
  return matches.length ? matches : ["General"];
}

window.AIGNewsData = { OUTLETS, TOPIC_SCHEMES, categorize };
