import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rules = await prisma.commissionRule.findMany({ orderBy: [{ tier: 'asc' }, { level: 'asc' }] })
const apps = await prisma.appRegistry.findMany({ orderBy: { created_at: 'asc' } })

console.log('=== COMMISSION RULES (' + rules.length + ' total) ===')
const grouped = {}
rules.forEach(r => { if (!grouped[r.tier]) grouped[r.tier] = []; grouped[r.tier].push(r) })
Object.entries(grouped).forEach(([tier, rs]) => {
  console.log('\n' + tier + ':')
  rs.forEach(r => console.log('  Level ' + r.level + ': ' + r.percent + '%'))
})

console.log('\n\n=== APP REGISTRY (' + apps.length + ' total) ===')
console.log('Name'.padEnd(25) + 'Slug'.padEnd(28) + 'Free  Starter  Color')
console.log('-'.repeat(75))
apps.forEach(a => {
  console.log(
    a.name.padEnd(25) +
    a.slug.padEnd(28) +
    String(a.free_access).padEnd(6) +
    String(a.starter_access).padEnd(9) +
    a.color
  )
})

await prisma.$disconnect()
