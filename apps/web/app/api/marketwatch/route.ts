import { NextResponse } from 'next/server'

export const revalidate = 300

type FeedConfig = {
  name: string
  url: string
  region: string
}

type NewsItem = {
  title: string
  link: string
  source: string
  region: string
  publishedAt: string
}

const FEEDS: FeedConfig[] = [
  {
    name: 'Reuters Business',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    region: 'Global',
  },
  {
    name: 'CNBC World',
    url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html',
    region: 'US/Global',
  },
  {
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/rss/topstories',
    region: 'Global',
  },
  {
    name: 'Investing.com',
    url: 'https://www.investing.com/rss/news_25.rss',
    region: 'Global',
  },
]

const FALLBACK_ITEMS: NewsItem[] = [
  {
    title: 'Global equity indices hold steady as traders await inflation signals',
    link: '#',
    source: 'AIG Market Desk',
    region: 'Global',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Energy and commodities remain in focus as supply narratives shift',
    link: '#',
    source: 'AIG Market Desk',
    region: 'EMEA',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'FX markets react to central bank guidance and treasury yield moves',
    link: '#',
    source: 'AIG Market Desk',
    region: 'Americas',
    publishedAt: new Date().toISOString(),
  },
]

function decodeEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return match ? decodeEntities(match[1]) : ''
}

function parseRss(xml: string, source: string, region: string): NewsItem[] {
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []

  return itemBlocks
    .slice(0, 8)
    .map((block) => {
      const title = extractTag(block, 'title')
      const link = extractTag(block, 'link')
      const pubDate = extractTag(block, 'pubDate')

      if (!title || !link) {
        return null
      }

      const published = pubDate ? new Date(pubDate) : new Date()

      return {
        title,
        link,
        source,
        region,
        publishedAt: Number.isNaN(published.getTime()) ? new Date().toISOString() : published.toISOString(),
      }
    })
    .filter((item): item is NewsItem => item !== null)
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'AIGINVEST-MarketWatch/1.0',
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch ${feed.name}: ${res.status}`)
      }

      const xml = await res.text()
      return parseRss(xml, feed.name, feed.region)
    })
  )

  const items = results
    .filter((result): result is PromiseFulfilledResult<NewsItem[]> => result.status === 'fulfilled')
    .flatMap((result) => result.value)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30)

  const payload = items.length > 0 ? items : FALLBACK_ITEMS

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: payload.length,
    items: payload,
  })
}
