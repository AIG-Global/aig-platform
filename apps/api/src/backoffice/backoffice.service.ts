import { Injectable } from '@nestjs/common'

type AccessCard = { label: string; value: string }
type RegionMetric = { region: string; hubs: number; members: number; growth: string; avgMinutes: number }
type GeneralMetric = { name: string; orgs: number; growth: string; risk: 'Low' | 'Watch'; spend: string; time: string }
type ActivityRow = { actor: string; action: string; duration: string; spend: string; city: string }
type OfferPreset = { name: string; value: string; label: string }
type SecurityTile = { title: string; detail: string; status: 'Active' | 'Planned' }

type BackofficeOverview = {
  access_cards: AccessCard[]
  summary_metrics: {
    live_events: string
    avg_time: string
    global_hubs: string
    generals_monitored: string
    gift_offers_ready: string
    announcements: string
  }
  network_regions: RegionMetric[]
  general_oversight: GeneralMetric[]
  activity_feed: ActivityRow[]
  offer_presets: OfferPreset[]
  selected_offer_name: string
  banner_ideas: string[]
  selected_banner_text: string
  selected_banner_target: string
  security_tiles: SecurityTile[]
  last_updated: string
}

@Injectable()
export class BackofficeService {
  private overview: BackofficeOverview = {
    access_cards: [
      { label: 'Route', value: '/admin/backoffice' },
      { label: 'Scope', value: 'Network command center' },
      { label: 'Mode', value: 'Read + action panels' },
      { label: 'Protection', value: 'Copy deterrence enabled' },
    ],
    summary_metrics: {
      live_events: '18,420',
      avg_time: '41m',
      global_hubs: '65',
      generals_monitored: '4',
      gift_offers_ready: '12',
      announcements: '3',
    },
    network_regions: [
      { region: 'Europe', hubs: 14, members: 1840, growth: '+18.2%', avgMinutes: 42 },
      { region: 'North America', hubs: 11, members: 1622, growth: '+12.4%', avgMinutes: 39 },
      { region: 'Middle East', hubs: 7, members: 840, growth: '+21.9%', avgMinutes: 47 },
      { region: 'Asia Pacific', hubs: 16, members: 2410, growth: '+26.1%', avgMinutes: 51 },
      { region: 'Africa', hubs: 9, members: 910, growth: '+16.7%', avgMinutes: 36 },
      { region: 'Latin America', hubs: 8, members: 760, growth: '+14.3%', avgMinutes: 33 },
    ],
    general_oversight: [
      { name: 'Northern Command', orgs: 18, growth: '+11.8%', risk: 'Low', spend: 'EUR 42,100', time: '38m' },
      { name: 'Pacific Command', orgs: 22, growth: '+17.6%', risk: 'Watch', spend: 'EUR 58,900', time: '44m' },
      { name: 'Central Command', orgs: 14, growth: '+8.4%', risk: 'Low', spend: 'EUR 31,250', time: '29m' },
      { name: 'Global Command', orgs: 31, growth: '+24.1%', risk: 'Watch', spend: 'EUR 96,480', time: '52m' },
    ],
    activity_feed: [
      { actor: 'User 4821', action: 'opened analytics dashboard', duration: '12m', spend: 'EUR 0', city: 'Berlin' },
      { actor: 'User 7752', action: 'purchased gift certificate', duration: '7m', spend: 'EUR 250', city: 'Paris' },
      { actor: 'General Pacific Command', action: 'reviewed organization growth', duration: '31m', spend: 'EUR 0', city: 'Singapore' },
      { actor: 'User 9910', action: 'engaged promo banner', duration: '19m', spend: 'EUR 120', city: 'London' },
    ],
    offer_presets: [
      { name: 'Starter Gift Offer', value: 'EUR 100 gift certificate + onboarding bonus', label: 'Launch' },
      { name: 'Growth Bundle', value: 'EUR 250 gift certificate + priority support', label: 'Promote' },
      { name: 'Executive Offer', value: 'EUR 500 gift certificate + campaign placement', label: 'Boost' },
    ],
    selected_offer_name: 'Growth Bundle',
    banner_ideas: [
      'Flash offer: gift certificates available this week only.',
      'Global growth summit starts in 48 hours.',
      'North Star command review open for selected leaders.',
    ],
    selected_banner_text: 'Flash offer: gift certificates available this week only.',
    selected_banner_target: 'All users',
    security_tiles: [
      { title: 'Copy deterrence', detail: 'Enabled across the app shell for text selection and copy/cut shortcuts.', status: 'Active' },
      { title: 'Session review', detail: 'Track logins, active duration, and action traces for admin review.', status: 'Planned' },
      { title: 'Banner approvals', detail: 'All promotions can be reviewed before publishing to the network.', status: 'Planned' },
      { title: 'General alerts', detail: 'Watch growth, risk, and organization drift for each command group.', status: 'Active' },
    ],
    last_updated: new Date().toISOString(),
  }

  getOverview() {
    return {
      ...this.overview,
      last_updated: new Date().toISOString(),
    }
  }

  selectOffer(name: string) {
    const exists = this.overview.offer_presets.some((offer) => offer.name === name)
    if (!exists) {
      return { ok: false, message: 'Offer not found', selected_offer_name: this.overview.selected_offer_name }
    }

    this.overview.selected_offer_name = name
    return { ok: true, selected_offer_name: this.overview.selected_offer_name }
  }

  publishBanner(text: string, target: string) {
    const safeText = (text || '').trim()
    if (!safeText) {
      return { ok: false, message: 'Banner text is required' }
    }

    this.overview.selected_banner_text = safeText
    this.overview.selected_banner_target = target || 'All users'

    this.overview.summary_metrics.announcements = String(
      Math.max(1, Number(this.overview.summary_metrics.announcements.replace(/[^0-9]/g, '') || '0'))
    )

    return {
      ok: true,
      selected_banner_text: this.overview.selected_banner_text,
      selected_banner_target: this.overview.selected_banner_target,
    }
  }
}
