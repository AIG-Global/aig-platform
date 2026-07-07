// ============================================================
// DATA MODEL — ONE Business Console
// All figures are illustrative sample data for the prototype.
// ============================================================

const DATA = {

  user: { name: "Markus Eklund", username: "markus_e", role: "Founder & CEO", initials: "ME", autonomy: "Rung 2" },

  // ---------------- HOME / BRIEFING ----------------
  briefing: {
    date: "Tuesday, 14 October",
    greeting: "Good morning, Markus.",
    items: [
      { icon:'calendar', accent:'amber', title:'Board meeting at 09:00', sub:'Agenda attached · Q3 numbers finalized overnight' },
      { icon:'plane', accent:'amber', title:'Flight to Frankfurt at 14:20', sub:'Leave by 12:30 — security lines running long today' },
      { icon:'cash', accent:'bad', title:'Runway dropped to 7.1 months', sub:'Burn rate up 12% in September — see Finance' },
      { icon:'pipeline', accent:'warn', title:'Helsinki Logistics deal stalling', sub:'No reply in 9 days — drafted a nudge for your review' },
      { icon:'contract', accent:'warn', title:'AWS contract auto-renews in 14 days', sub:'Rate increased 18% from last term — flagged for renegotiation' },
      { icon:'wallet', accent:'gold', title:'AIG wallet up 1.8% overnight', sub:'14,230 tokens · 2 new referrals, €96 commission' },
    ]
  },

  // ---------------- FINANCE ----------------
  finance: {
    cash: 284600,
    cashDelta: -3.1,
    burn: 39800,
    burnDelta: 12.4,
    runwayMonths: 7.1,
    runwayDelta: -0.6,
    mrr: 61200,
    mrrDelta: 4.2,
    sparkCash: [320,318,312,305,301,296,290,287,284,284.6].map(v=>v*1000/320),
    accounts: [
      { name:'Operating — Nordea', balance: 184200, type:'EUR Operating' },
      { name:'Reserve — Nordea', balance: 60000, type:'EUR Reserve' },
      { name:'AIG Treasury', balance: 40400, type:'AIG Tokens · ≈€40,400' },
    ],
    receivables: [
      { client:'Helsinki Logistics Oy', amount: 18400, daysOverdue: 12, status:'overdue' },
      { client:'Nordic Retail Group', amount: 9200, daysOverdue: 0, status:'upcoming' },
      { client:'Baltic Freight AB', amount: 27600, daysOverdue: 34, status:'overdue' },
      { client:'Arctic Components Ltd', amount: 5400, daysOverdue: 0, status:'upcoming' },
    ],
    expenseCategories: [
      { label:'Payroll', value: 24600, color:'var(--amber)' },
      { label:'Software & tools', value: 5200, color:'var(--teal)' },
      { label:'Office & facilities', value: 3100, color:'var(--purple)' },
      { label:'Marketing', value: 4400, color:'var(--gold)' },
      { label:'Travel', value: 2500, color:'var(--bad)' },
    ],
    alerts: [
      { sev:'bad', title:'Burn rate up 12% in September', detail:'Mostly driven by a one-off hiring agency fee (€6,200) and increased AWS spend. Excluding the one-off, underlying burn is up only 3%.' },
      { sev:'warn', title:'Two invoices now overdue >30 days', detail:'Baltic Freight AB (34 days, €27,600) is the largest. ONE has sent two reminders; suggest a call.' },
      { sev:'good', title:'MRR grew 4.2% this month', detail:'Driven by 3 upsells on the Nordic Retail and Arctic accounts — no new churn.' },
    ],
  },

  // ---------------- SALES ----------------
  sales: {
    pipelineValue: 412000,
    pipelineDelta: 6.8,
    winRate: 28,
    avgDealSize: 14200,
    dealsAtRisk: 3,
    stages: [
      { name:'Lead', count: 22, value: 88000 },
      { name:'Qualified', count: 14, value: 126000 },
      { name:'Proposal', count: 7, value: 98000 },
      { name:'Negotiation', count: 4, value: 64000 },
      { name:'Closing', count: 2, value: 36000 },
    ],
    deals: [
      { name:'Helsinki Logistics Oy', stage:'Negotiation', value: 38000, lastTouch:'9 days ago', risk:'high', note:'No reply since last proposal revision. ONE drafted a follow-up.' },
      { name:'Nordic Retail Group — expansion', stage:'Proposal', value: 22000, lastTouch:'2 days ago', risk:'low', note:'Positive signals; champion is internally pushing for approval.' },
      { name:'Baltic Freight AB — renewal', stage:'Closing', value: 31000, lastTouch:'1 day ago', risk:'low', note:'Verbal yes received, contract drafted and sent for signature.' },
      { name:'Arctic Components Ltd', stage:'Qualified', value: 16000, lastTouch:'14 days ago', risk:'high', note:'Gone quiet after a promising first call. Suggest re-engagement.' },
      { name:'Polar Materials AS', stage:'Negotiation', value: 27000, lastTouch:'4 days ago', risk:'med', note:'Price objection raised; ONE prepared 3 concession options.' },
    ],
    churnRisk: [
      { client:'Saimaa Manufacturing', signal:'Support tickets up 3x, usage down 40% in 60 days', severity:'high' },
      { client:'Lapland Energy Partners', signal:'Champion left the company 3 weeks ago, no new contact identified', severity:'high' },
      { client:'Turku Marine Supplies', signal:'Renewal in 45 days, engagement steady', severity:'low' },
    ],
  },

  // ---------------- OPERATIONS ----------------
  ops: {
    activeProjects: 6,
    onTrack: 4,
    atRisk: 2,
    projects: [
      { name:'Frankfurt market entry', owner:'Markus', progress: 68, status:'on-track', due:'12 Nov' },
      { name:'Platform v3 migration', owner:'Eng team', progress: 41, status:'at-risk', due:'30 Oct', note:'Blocked on third-party API access since Monday' },
      { name:'Q4 board deck', owner:'Markus', progress: 80, status:'on-track', due:'16 Oct' },
      { name:'Warehouse automation pilot', owner:'Ops team', progress: 22, status:'at-risk', due:'8 Nov', note:'Vendor equipment delayed 3 weeks' },
      { name:'New hire onboarding flow', owner:'People team', progress: 90, status:'on-track', due:'18 Oct' },
      { name:'ISO 27001 prep', owner:'Compliance', progress: 55, status:'on-track', due:'15 Dec' },
    ],
    contracts: [
      { vendor:'AWS', type:'Cloud infrastructure', renews:'14 days', delta:'+18%', flag:'bad' },
      { vendor:'Salesforce', type:'CRM licence', renews:'52 days', delta:'+4%', flag:'warn' },
      { vendor:'WeWork Helsinki', type:'Office lease', renews:'118 days', delta:'0%', flag:'good' },
      { vendor:'Slack', type:'Team messaging', renews:'201 days', delta:'+2%', flag:'good' },
    ],
    vendors: [
      { name:'Nordic Freight Partners', category:'Logistics', spend: 8200, onTimeRate: 94 },
      { name:'CloudPrint Oy', category:'Packaging', spend: 3100, onTimeRate: 78 },
      { name:'Baltic Components', category:'Hardware supply', spend: 12400, onTimeRate: 88 },
    ],
  },

  // ---------------- PEOPLE ----------------
  people: {
    headcount: 24,
    openRoles: 2,
    avgTenure: 1.8,
    attritionRiskCount: 2,
    pipeline: [
      { role:'Operations Lead', stage:'Final interview', candidate:'Janne Virtanen', next:'Offer decision due Friday' },
      { role:'Senior Backend Engineer', stage:'Technical screen', candidate:'2 candidates shortlisted', next:'Interviews scheduled next week' },
    ],
    reviews: [
      { name:'Aino Salonen', team:'Sales', due:'in 5 days', status:'draft-ready' },
      { name:'Petri Laine', team:'Engineering', due:'in 9 days', status:'scheduled' },
      { name:'Liisa Korhonen', team:'Operations', due:'in 21 days', status:'not-started' },
    ],
    attritionSignals: [
      { name:'Topi Nieminen', team:'Engineering', signal:'Calendar density down 35%, no PTO booked in 4 months', severity:'med' },
      { name:'Reetta Mäkelä', team:'Customer Success', signal:'Declined 2 team socials, LinkedIn activity increased sharply', severity:'high' },
    ],
    compliance: [
      { item:'Work permit — Hassan A.', due:'in 38 days', type:'visa' },
      { item:'Annual H&S training', due:'in 60 days', type:'training' },
      { item:'Payroll tax filing — Q3', due:'in 11 days', type:'filing' },
    ],
  },

  // ---------------- LEGAL & COMPLIANCE ----------------
  legal: {
    activeContracts: 31,
    flaggedClauses: 4,
    ipRenewals: 2,
    contractsReview: [
      { name:'Helsinki Logistics — Service Agreement', type:'Customer contract', flag:'Liability cap is uncapped — wider than your standard template', severity:'high' },
      { name:'AWS Enterprise Agreement', type:'Vendor contract', flag:'Auto-renewal clause with 18% rate increase, 14-day notice window', severity:'high' },
      { name:'Office Sublease — WeWork', type:'Lease', flag:'Standard terms, no action needed', severity:'low' },
      { name:'NDA — Polar Materials AS', type:'Mutual NDA', flag:'Term extended to 5 years vs your standard 3 — under review', severity:'med' },
    ],
    ip: [
      { mark:'AIG wordmark', jurisdiction:'EU', renews:'in 94 days' },
      { mark:'ONE logo device', jurisdiction:'Finland', renews:'in 210 days' },
    ],
    regulatory: [
      { item:'GDPR data processing record update', due:'in 18 days', note:'New vendor (analytics) needs to be added to the register' },
      { item:'AIG KYC re-verification', due:'in 41 days', note:'Standard annual refresh for network compliance' },
    ],
  },

  // ---------------- AIG NETWORK ----------------
  aig: {
    walletBalance: 14230,
    walletDeltaPct: 1.8,
    eurEquivalent: 14230,
    ltAllocation: 60,
    stAllocation: 40,
    ltMatures: 42,
    networkSize: 342,
    networkNewWeek: 9,
    monthCommission: 1840,
    commissionSources: [
      { label:'Direct referrals (Level 1)', value: 980 },
      { label:'Network depth (Level 2–3)', value: 540 },
      { label:'WDM marketplace bookings', value: 220 },
      { label:'Tag Markets activity share', value: 100 },
    ],
    tradingStatus: { position:'flat', risk:'none', lastChecked:'6 min ago' },
    wdmBookings: [
      { name:'UAE Company Formation', status:'In review', step:3, totalSteps:5 },
      { name:'Offshore banking — Mauritius', status:'Documents requested', step:2, totalSteps:4 },
    ],
    compliance: { kycStatus:'Verified', insurance:'$1,000,000 active', nextReview:'41 days' },
  },

  // ---------------- COMMAND RESPONSES ----------------
  // Keyed scripted responses for the demo command bar.
  responses: [
    {
      keys: ['runway','cash','burn','money left'],
      accent:'amber',
      query: 'How much runway do we have left?',
      html: `At the current burn rate of <strong>€39,800/month</strong>, you have <strong>7.1 months</strong> of runway left — down from 7.8 last month. The increase in burn is mostly a one-off hiring agency fee; underlying burn only rose 3%. Two overdue invoices total <strong>€46,000</strong> — collecting those would add another 1.2 months.`,
      meta: [ {label:'Runway', value:'7.1 mo'}, {label:'Monthly burn', value:'€39.8k'}, {label:'Overdue AR', value:'€46.0k'} ],
      goto: 'finance',
    },
    {
      keys: ['pipeline','deals','sales','revenue forecast'],
      accent:'amber',
      query: 'What does the sales pipeline look like?',
      html: `Pipeline is at <strong>€412,000</strong>, up 6.8% from last week. <strong>3 deals are at risk</strong> of stalling — Helsinki Logistics has gone quiet for 9 days, and Arctic Components hasn't responded in 14. ONE has drafted re-engagement messages for both, ready for your review.`,
      meta: [ {label:'Pipeline', value:'€412k'}, {label:'Win rate', value:'28%'}, {label:'At risk', value:'3 deals'} ],
      goto: 'sales',
    },
    {
      keys: ['contracts','renewal','aws','legal risk'],
      accent:'amber',
      query: 'Any contracts I should worry about?',
      html: `Yes — two. Your <strong>AWS agreement auto-renews in 14 days</strong> with an 18% rate increase already built in; worth renegotiating before it locks. Separately, the <strong>Helsinki Logistics service agreement</strong> has an uncapped liability clause, wider than your standard template — flagged for legal review before the next signature.`,
      meta: [ {label:'Renewing soon', value:'2 contracts'}, {label:'Flagged clauses', value:'4 total'} ],
      goto: 'legal',
    },
    {
      keys: ['network','commission','referral','aig wallet','tokens'],
      accent:'gold',
      query: 'How is the AIG network doing?',
      html: `Your network reached <strong class="g">342 members</strong> this week, up 9 new referrals. This month's commission stands at <strong class="g">€1,840</strong> — €980 from direct referrals, €540 from deeper network levels, and the rest from WDM bookings and Tag Markets activity. Your wallet is up 1.8% overnight to 14,230 tokens.`,
      meta: [ {label:'Network', value:'342'}, {label:'Commission MTD', value:'€1,840'}, {label:'Wallet', value:'14,230'} ],
      goto: 'aig',
    },
    {
      keys: ['team','attrition','people','headcount','hiring'],
      accent:'amber',
      query: 'How is the team doing?',
      html: `Headcount is steady at <strong>24</strong>, with 2 open roles in active pipeline. Two attrition signals worth your attention: <strong>Reetta Mäkelä</strong>'s engagement pattern shifted sharply this month, and <strong>Topi Nieminen</strong> hasn't taken time off in 4 months. Worth a quiet check-in with both before the next review cycle.`,
      meta: [ {label:'Headcount', value:'24'}, {label:'Open roles', value:'2'}, {label:'Attrition signals', value:'2'} ],
      goto: 'people',
    },
    {
      keys: ['leave','airport','flight','traffic'],
      accent:'amber',
      query: 'When should I leave for the airport?',
      html: `Leave by <strong>12:30</strong>. Traffic on the airport route is heavier than usual today, and your flight to Frankfurt boards at 14:20. Security wait times are also running long this afternoon — ONE built in a buffer.`,
      meta: [ {label:'Leave by', value:'12:30'}, {label:'Flight', value:'14:20'}, {label:'Buffer added', value:'15 min'} ],
      goto: 'home',
    },
  ],
};

window.DATA = DATA;

// ============================================================
// EXTENDED DATA — Identity, Health, Network Invites, Legal, Membership
// ============================================================

DATA.assistantVoices = {
  female: [
    { id:'aria', label:'Aria', desc:'Warm, clear, Nordic-neutral accent' },
    { id:'luna', label:'Luna', desc:'Calm, measured, lower register' },
  ],
  male: [
    { id:'atlas', label:'Atlas', desc:'Confident, even-toned' },
    { id:'felix', label:'Felix', desc:'Friendly, slightly faster pace' },
  ],
  neutral: [
    { id:'sol', label:'Sol', desc:'Balanced, androgynous tone' },
  ],
};

DATA.languages = [
  { code:'en', label:'English' },
  { code:'fi', label:'Suomi (Finnish)' },
  { code:'sv', label:'Svenska (Swedish)' },
  { code:'de', label:'Deutsch (German)' },
  { code:'fr', label:'Français (French)' },
  { code:'es', label:'Español (Spanish)' },
  { code:'zh', label:'中文 (Chinese)' },
  { code:'ar', label:'العربية (Arabic)' },
];

// A tiny illustrative phrase set so the Interpreter view has something
// real to demonstrate without a live translation backend.
DATA.phraseBook = {
  "good morning": { fi:"hyvää huomenta", sv:"god morgon", de:"guten Morgen", fr:"bonjour", es:"buenos días", zh:"早上好", ar:"صباح الخير" },
  "where is the meeting": { fi:"missä kokous on", sv:"var är mötet", de:"wo ist das Treffen", fr:"où est la réunion", es:"dónde es la reunión", zh:"会议在哪里", ar:"أين الاجتماع" },
  "thank you for your time": { fi:"kiitos ajastasi", sv:"tack för din tid", de:"danke für Ihre Zeit", fr:"merci pour votre temps", es:"gracias por su tiempo", zh:"感谢您的时间", ar:"شكرا لوقتك" },
  "can we reschedule": { fi:"voimmeko siirtää ajan", sv:"kan vi boka om", de:"können wir verschieben", fr:"pouvons-nous reporter", es:"podemos reprogramar", zh:"我们可以重新安排吗", ar:"هل يمكننا تغيير الموعد" },
};

DATA.health = {
  connected: { googleHealth: true, smartwatch: true, watchModel: 'Pulse Series 4' },
  vitals: {
    heartRate: 71,
    heartRateTrend: [68,70,69,72,71,73,71,70,71,71],
    spo2: 98,
    sleepHoursLastNight: 6.4,
    stressLevel: 'moderate',
    steps: 4280,
    stepsGoal: 9000,
  },
  thresholds: {
    heartRateHigh: 150,
    heartRateLow: 40,
    spo2Low: 90,
  },
  emergencyContacts: [
    { name:'Liisa Eklund', relation:'Spouse', phone:'+358 40 555 0102' },
    { name:'Dr. Hannu Räsänen', relation:'Physician', phone:'+358 9 555 0199' },
  ],
  log: [
    { time:'07:02', event:'Morning vitals synced from Pulse Series 4 — all normal' },
    { time:'13:15', event:'Stress level elevated during board call — noted, no action needed' },
  ],
};

DATA.network = {
  inviteLink: 'https://onephone.ai/join?ref=ME8841',
  inviteCode: 'ME8841',
  sponsor: null, // set during registration if applicable
  invitesSent: 14,
  invitesJoined: 9,
  freeJoined: 6,
  paidJoined: 3,
  recentInvites: [
    { name:'Janne Virtanen', status:'joined-paid', when:'2 days ago' },
    { name:'Aino Salonen', status:'joined-free', when:'5 days ago' },
    { name:'Topi Nieminen', status:'pending', when:'sent 1 day ago' },
    { name:'Reetta Mäkelä', status:'joined-free', when:'9 days ago' },
  ],
};

DATA.legal = DATA.legal || {};
DATA.legal.jurisdiction = 'Finland';
DATA.legal.documentTemplates = [
  { id:'nda', name:'Mutual NDA', desc:'Standard confidentiality agreement between two parties', est:'2 min to draft' },
  { id:'contractor', name:'Contractor Agreement', desc:'Independent contractor terms, IP assignment, payment schedule', est:'3 min to draft' },
  { id:'employment', name:'Employment Contract', desc:'Drafted to Finnish Employment Contracts Act baseline terms', est:'4 min to draft' },
  { id:'terms', name:'Terms of Service', desc:'Customer-facing terms for a digital product or service', est:'5 min to draft' },
  { id:'dataproc', name:'Data Processing Agreement', desc:'GDPR-aligned DPA for a vendor or sub-processor', est:'4 min to draft' },
];

DATA.membership = {
  tier: 'free', // 'free' | 'paid' — toggled in the demo via Settings
  paidPriceNote: 'Package A from €399 · unlocks Finance, Sales, Ops, People, Legal, and AIG Network',
};

