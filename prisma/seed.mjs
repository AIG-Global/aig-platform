import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const COMMISSION_RULES = [
  // FREE: 1 level
  { tier: 'FREE', level: 1, percent: 10.0 },
  // STARTER: 3 levels
  { tier: 'STARTER', level: 1, percent: 26.0 },
  { tier: 'STARTER', level: 2, percent: 15.0 },
  { tier: 'STARTER', level: 3, percent: 8.0 },
  // PROFESSIONAL: 10 levels
  { tier: 'PROFESSIONAL', level: 1, percent: 26.0 },
  { tier: 'PROFESSIONAL', level: 2, percent: 18.0 },
  { tier: 'PROFESSIONAL', level: 3, percent: 12.0 },
  { tier: 'PROFESSIONAL', level: 4, percent: 10.0 },
  { tier: 'PROFESSIONAL', level: 5, percent: 8.0 },
  { tier: 'PROFESSIONAL', level: 6, percent: 6.0 },
  { tier: 'PROFESSIONAL', level: 7, percent: 4.0 },
  { tier: 'PROFESSIONAL', level: 8, percent: 2.0 },
  { tier: 'PROFESSIONAL', level: 9, percent: 1.0 },
  { tier: 'PROFESSIONAL', level: 10, percent: 0.5 },
  // BUSINESS: 10 levels
  { tier: 'BUSINESS', level: 1, percent: 30.0 },
  { tier: 'BUSINESS', level: 2, percent: 20.0 },
  { tier: 'BUSINESS', level: 3, percent: 15.0 },
  { tier: 'BUSINESS', level: 4, percent: 12.0 },
  { tier: 'BUSINESS', level: 5, percent: 10.0 },
  { tier: 'BUSINESS', level: 6, percent: 8.0 },
  { tier: 'BUSINESS', level: 7, percent: 6.0 },
  { tier: 'BUSINESS', level: 8, percent: 4.0 },
  { tier: 'BUSINESS', level: 9, percent: 2.0 },
  { tier: 'BUSINESS', level: 10, percent: 1.0 },
  // ENTERPRISE: 10 levels
  { tier: 'ENTERPRISE', level: 1, percent: 35.0 },
  { tier: 'ENTERPRISE', level: 2, percent: 25.0 },
  { tier: 'ENTERPRISE', level: 3, percent: 18.0 },
  { tier: 'ENTERPRISE', level: 4, percent: 15.0 },
  { tier: 'ENTERPRISE', level: 5, percent: 12.0 },
  { tier: 'ENTERPRISE', level: 6, percent: 10.0 },
  { tier: 'ENTERPRISE', level: 7, percent: 8.0 },
  { tier: 'ENTERPRISE', level: 8, percent: 6.0 },
  { tier: 'ENTERPRISE', level: 9, percent: 4.0 },
  { tier: 'ENTERPRISE', level: 10, percent: 2.0 },
]

const APPS = [
  {
    name: 'AIG-Ask',
    slug: 'aig-ask',
    description: 'AI-powered Q&A and knowledge assistant',
    color: '#FF6B6B',
    free_access: true,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-Business-Weather',
    slug: 'aig-business-weather',
    description: 'Market and business intelligence platform',
    color: '#4ECDC4',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-HELO',
    slug: 'aig-helo',
    description: 'Helicopter view analytics dashboard',
    color: '#45B7D1',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-Investor-Alerts',
    slug: 'aig-investor-alerts',
    description: 'Real-time investment opportunity alerts',
    color: '#F7B731',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-MoneyGames',
    slug: 'aig-moneygames',
    description: 'Gamified financial learning platform',
    color: '#5F27CD',
    free_access: true,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-News',
    slug: 'aig-news',
    description: 'Curated financial and business news feed',
    color: '#00D2D3',
    free_access: true,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-Record',
    slug: 'aig-record',
    description: 'Secure document and transaction recording',
    color: '#FF9FF3',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-Secure-Sign',
    slug: 'aig-secure-sign',
    description: 'Blockchain-verified digital signatures',
    color: '#54A0FF',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'AIG-Translate',
    slug: 'aig-translate',
    description: 'Multi-language translation engine',
    color: '#48DBFB',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
  {
    name: 'Diana AI',
    slug: 'diana-ai',
    description: 'Personal AI assistant and chatbot',
    color: '#D4AF37',
    free_access: false,
    starter_access: true,
    professional_access: true,
  },
]

async function main() {
  console.log('Seeding commission rules...')
  let rulesCreated = 0
  let rulesSkipped = 0

  for (const rule of COMMISSION_RULES) {
    const existing = await prisma.commissionRule.findUnique({
      where: { tier_level: { tier: rule.tier, level: rule.level } },
    })
    if (!existing) {
      await prisma.commissionRule.create({ data: rule })
      rulesCreated++
    } else {
      rulesSkipped++
    }
  }
  console.log(`Commission rules: ${rulesCreated} created, ${rulesSkipped} already existed`)

  console.log('Seeding app registry...')
  let appsCreated = 0
  let appsSkipped = 0

  for (const app of APPS) {
    const existing = await prisma.appRegistry.findUnique({
      where: { slug: app.slug },
    })
    if (!existing) {
      await prisma.appRegistry.create({ data: app })
      appsCreated++
    } else {
      appsSkipped++
    }
  }
  console.log(`Apps: ${appsCreated} created, ${appsSkipped} already existed`)

  console.log('\nSeed complete!')
  console.log(`Total commission rules in DB: ${await prisma.commissionRule.count()}`)
  console.log(`Total apps in DB: ${await prisma.appRegistry.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
