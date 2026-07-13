export type MembershipId = 'packagea' | 'packageb' | 'packagec' | 'professional'

export type ToolkitApp = {
  id: string
  name: string
  icon: string
  description: string
  tagline?: string
  highlights?: string[]
  notice?: string
  minPackage: MembershipId
  relativeHtmlPath: string
}

export const PACKAGE_ORDER: MembershipId[] = ['packagea', 'packageb', 'packagec', 'professional']

export const PACKAGE_LABELS: Record<MembershipId, string> = {
  packagea: 'Package A',
  packageb: 'Package B',
  packagec: 'Package C',
  professional: 'Professional',
}

export const TOOLKIT_APPS: ToolkitApp[] = [
  {
    id: 'aig-ask',
    name: 'AIG Ask',
    icon: '💬',
    description: 'Bring Claude conversational AI directly into your workflow as a full app or lightweight widget.',
    tagline: 'Claude, exactly where you need it.',
    highlights: [
      'Use it as a dedicated page or embed it on your site with two lines of code.',
      'Connect your own Anthropic API key with no backend required to get started.',
      'Supports real markdown, code blocks, and formatted responses.',
      'Start solo now and reconfigure later for team-wide shared access.',
    ],
    minPackage: 'packagea',
    relativeHtmlPath: 'AIG-Ask/aig-chat/index.html',
  },
  {
    id: 'aig-business-weather',
    name: 'AIG Business Weather',
    icon: '🌦️',
    description: 'Professional-grade forecasts with animated visuals and practical hazard guidance.',
    tagline: 'Weather that speaks your language and shows it.',
    highlights: [
      'Visual cues like rain, lightning, and sky conditions make weather instantly readable.',
      'Calibrated alerts separate routine conditions from serious threats.',
      'Plain-language heads-ups help with practical daily decisions.',
      'Built to support reliable notifications when conditions shift.',
    ],
    notice: 'Complements official emergency systems and supports early preparation.',
    minPackage: 'packagea',
    relativeHtmlPath: 'AIG-Business-Weather/aig-weather/index.html',
  },
  {
    id: 'aig-helo',
    name: 'AIG HELO',
    icon: '🆘',
    description: 'Emergency companion for travelers with embassy and local emergency access in one place.',
    tagline: 'Emergency help, one tap away.',
    highlights: [
      'Set nationality once and keep embassy access ready.',
      'GPS-based location logic surfaces local police, ambulance, and fire contacts.',
      'Large, clear call actions designed for high-stress moments.',
      'Emergency access remains available before full profile completion.',
    ],
    minPackage: 'packagea',
    relativeHtmlPath: 'AIG-HELO/aig-help/index.html',
  },
  {
    id: 'aig-investor-alerts',
    name: 'AIG Investor Alerts',
    icon: '🚨',
    description: 'Transparent correlation and fundamentals analysis across stocks, crypto, and commodities.',
    tagline: 'Data-driven clarity in a noisy market.',
    highlights: [
      'Interactive correlation views show how watchlist assets move together or diverge.',
      'Compare value, growth, and profitability with clear metrics.',
      'AI summaries explain complex views in plain language while staying grounded in data.',
    ],
    notice: 'Investing involves risk. Insights support decisions but do not guarantee outcomes.',
    minPackage: 'packageb',
    relativeHtmlPath: 'AIG-Investor-Alerts/market-app/index.html',
  },
  {
    id: 'aig-me',
    name: 'AIG Me',
    icon: '👤',
    description: 'Private personal relationship manager that works only from what you choose to add.',
    tagline: 'Your relationships, fully private and under your control.',
    highlights: [
      'Track birthdays, anniversaries, and key dates by urgency.',
      'Tag people manually in group photos with your own labels.',
      'Keep private notes and personal insights without algorithmic scoring.',
      'Log and organize discoveries about your online footprint in one place.',
    ],
    notice: 'No facial recognition, background scraping, or hidden tracking.',
    minPackage: 'packagea',
    relativeHtmlPath: 'AIG-Me_2/aig-me/index.html',
  },
  {
    id: 'aig-moneygames',
    name: 'AIG MoneyGames',
    icon: '🎮',
    description: 'Casino-style entertainment with virtual coins only and transparent game math.',
    tagline: 'All the fun of the casino floor. None of the stakes.',
    highlights: [
      'Slots, blackjack, and roulette with virtual coins that have no cash value.',
      'Monthly-reset competition creates a fresh leaderboard each cycle.',
      'Published paytables and visible RTP math are computed from real numbers.',
      'Cryptographically secure randomness with no manipulative near-miss design.',
    ],
    minPackage: 'packageb',
    relativeHtmlPath: 'AIG-MoneyGames/aig-moneygames/index.html',
  },
  {
    id: 'aig-news',
    name: 'AIG News',
    icon: '📰',
    description: 'Curated global headlines and video from trusted sources with transparent categorization.',
    tagline: 'Headlines that actually make sense.',
    highlights: [
      'Switch between World and Politics, and Markets, Crypto, and Innovation.',
      'Use search, filters, and regional/source following to shape your feed.',
      'Includes verified official-channel video alongside text reporting.',
      'Categories reflect content directly, not outrage-first ranking.',
    ],
    minPackage: 'packagea',
    relativeHtmlPath: 'AIG-News/aig-news/index.html',
  },
  {
    id: 'aig-record',
    name: 'AIG Record',
    icon: '📼',
    description: 'Capture meetings and calls into searchable transcripts with timestamped, export-ready records.',
    tagline: 'Record it. Transcribe it. Keep it.',
    highlights: [
      'Captures sessions from major meeting tools visible on your screen.',
      'Whisper-powered transcription includes segment-level timestamps.',
      'Long sessions split and stitch automatically into a continuous timeline.',
      'Export professional PDFs with title, duration, bookmarks, and full transcript.',
    ],
    minPackage: 'packageb',
    relativeHtmlPath: 'AIG-Record/aig-record/index.html',
  },
  {
    id: 'aig-secure-sign',
    name: 'AIG Secure Sign',
    icon: '✍️',
    description: 'Tamper-evident e-signing workflow with cryptographic audit integrity.',
    tagline: 'E-signing you can actually trust.',
    highlights: [
      'Every action in the signing flow is hash-linked for tamper detection.',
      'Recipients can review and sign from a link without account friction.',
      'Drag-and-drop fields support signatures, initials, dates, and text.',
      'Signed outputs include a verifiable audit trail.',
    ],
    notice: 'Designed around the technical foundation of Advanced Electronic Signatures under eIDAS.',
    minPackage: 'packagec',
    relativeHtmlPath: 'AIG-Secure-Sign/aig-sign/index.html',
  },
  {
    id: 'aig-translate',
    name: 'AIG Translate',
    icon: '🌐',
    description: 'Claude-powered translation as a full page or drop-in widget for sites and workflows.',
    tagline: 'Say it in any language, without breaking your flow.',
    highlights: [
      'Detects source language automatically in the same request.',
      'Supports 28 high-quality major world languages.',
      'Embed widget mode in two lines with no backend needed to start.',
      'Works with your own key now and can switch to shared backend later.',
    ],
    minPackage: 'packageb',
    relativeHtmlPath: 'AIG-Translate/aig-translate/index.html',
  },
  {
    id: 'aig-website',
    name: 'AIG Website',
    icon: '🏠',
    description: 'Website experience app for main public-facing presentation and navigation.',
    minPackage: 'packagea',
    relativeHtmlPath: 'AIG-website/aig-site/index.html',
  },
]

export const packageLevel = (pkg: MembershipId) => PACKAGE_ORDER.indexOf(pkg)

export const normalizeMembershipId = (value: string | null | undefined): MembershipId => {
  const normalized = (value ?? '').trim().toLowerCase()

  if (normalized === 'professional' || normalized === 'pro+' || normalized === 'pro_plus') return 'professional'
  if (normalized === 'packagec' || normalized === 'pro') return 'packagec'
  if (normalized === 'packageb' || normalized === 'growth') return 'packageb'
  if (normalized === 'packagea' || normalized === 'starter') return 'packagea'

  return 'packagea'
}
