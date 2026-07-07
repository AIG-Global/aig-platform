#!/usr/bin/env node
// ============================================================
// scripts/change-admin-password.js — Change the admin login
// password. The seeded default (admin / aig-admin-2026) is for
// local testing only and must be changed before any real
// deployment is reachable from the internet.
//
// Usage:
//   node scripts/change-admin-password.js <username> <new-password>
//
// Example:
//   node scripts/change-admin-password.js admin "a much better password 2027!"
// ============================================================

const Store = require('../lib/store');
const Auth = require('../services/auth');

async function main() {
  const [username, newPassword] = process.argv.slice(2);
  if (!username || !newPassword) {
    console.error('Usage: node scripts/change-admin-password.js <username> <new-password>');
    process.exit(1);
  }
  if (newPassword.length < 12) {
    console.error('Choose a password with at least 12 characters.');
    process.exit(1);
  }

  const admin = Store.findOne('admins', (a) => a.username === username);
  if (!admin) {
    console.error(`No admin found with username "${username}".`);
    process.exit(1);
  }

  const passwordHash = Auth.hashPassword(newPassword);
  await Store.update('admins', admin.id, { passwordHash });
  console.log(`Password updated for admin "${username}".`);
}

main().catch((err) => { console.error(err); process.exit(1); });
