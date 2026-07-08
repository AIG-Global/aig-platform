import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'mikko.antila@me.com';
  const nickname = 'trskelion';
  const password = 'Energia1';
  
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (user) {
      console.log('✅ User already exists:');
      console.log(`   Email: ${user.email}`);
      console.log(`   First Name: ${user.first_name || 'N/A'}`);
      console.log(`   Last Name: ${user.last_name || 'N/A'}`);
      console.log(`   ID: ${user.id}`);
    } else {
      console.log('❌ User does not exist. Creating...');
      
      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      
      // Create user
      user = await prisma.user.create({
        data: {
          email,
          password_hash,
          first_name: nickname,
          last_name: 'Antila',
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date()
        }
      });
      
      console.log('✅ User created successfully:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Nickname: ${user.first_name}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Password: ${password} (hashed in database)`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
