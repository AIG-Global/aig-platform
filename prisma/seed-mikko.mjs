import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Simple password hash using crypto (for demo - in production use bcrypt)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

async function generateGiftCardCode() {
  // Format: GCARD-XXXXXX-XXXXXX (e.g., GCARD-A1B2C3-D4E5F6)
  const part1 = crypto.randomBytes(3).toString('hex').toUpperCase()
  const part2 = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `GCARD-${part1}-${part2}`
}

async function seed() {
  console.log('🌱 Starting seed...')

  try {
    // 1. Create or find Mikko Antila user account
    console.log('👤 Finding or creating user account for Mikko Antila...')
    
    let user = await prisma.user.findUnique({
      where: { email: 'mikko.antila@me.com' },
    })

    if (!user) {
      const hashedPassword = hashPassword('Energia1mikko')
      
      user = await prisma.user.create({
        data: {
          email: 'mikko.antila@me.com',
          password_hash: hashedPassword,
          first_name: 'Mikko',
          last_name: 'Antila',
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date(),
          created_at: new Date(),
        },
      })
      console.log(`✅ User created: ${user.email} (ID: ${user.id})`)
    } else {
      console.log(`✅ User found: ${user.email} (ID: ${user.id})`)
    }

    // 2. Create 25 gift cards for each package type
    const packages = [
      { type: 'STARTER', value: 399 },
      { type: 'STARTUP', value: 999 },
      { type: 'PROFESSIONAL', value: 2999 },
    ]

    for (const pkg of packages) {
      console.log(`\n💳 Generating 25 gift cards for ${pkg.type} (€${pkg.value})...`)
      
      const giftCards = []
      for (let i = 0; i < 25; i++) {
        const code = await generateGiftCardCode()
        giftCards.push({
          code,
          packageType: pkg.type,
          valueEur: pkg.value,
          status: 'ACTIVE',
          createdAt: new Date(),
        })
      }

      // Batch insert
      const created = await prisma.giftCard.createMany({
        data: giftCards,
        skipDuplicates: true,
      })

      console.log(`✅ Created ${created.count} ${pkg.type} gift cards`)
    }

    console.log('\n\n╔════════════════════════════════════════════════════════════╗')
    console.log('║          🎉 ACCOUNT SETUP COMPLETE 🎉                     ║')
    console.log('╚════════════════════════════════════════════════════════════╝')
    console.log(`\n📧 Email: mikko.antila@me.com`)
    console.log(`🔐 Password: Energia1mikko`)
    console.log(`\n📝 Account Details:`)
    console.log(`   • Name: Mikko Antila`)
    console.log(`   • Status: ACTIVE`)
    console.log(`   • Email Verified: Yes`)
    console.log(`\n💳 Gift Cards Created: 75 total`)
    console.log(`   • 25 × STARTER (€399 each)`)
    console.log(`   • 25 × STARTUP (€999 each)`)
    console.log(`   • 25 × PROFESSIONAL (€2,999 each)`)
    console.log(`\n💰 Total Gift Card Value: €89,925`)
    console.log(`   • STARTER Total: €9,975 (25 × €399)`)
    console.log(`   • STARTUP Total: €24,975 (25 × €999)`)
    console.log(`   • PROFESSIONAL Total: €74,975 (25 × €2,999)`)
    console.log('\n🌍 You are now the first account in the AIGINVEST ecosystem!\n')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
