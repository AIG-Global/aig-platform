// Flat JSON storage — same honest-limitations pattern as the other AIG
// backend examples. Fine for trying this out, not fine for real
// traffic (no concurrent-write safety, full-file rewrite per change,
// no indexing). Replace with a real database before real use.

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "players.json");

function readAll() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch (e) { return []; }
}
function writeAll(users) { fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2)); }

async function upsertUser(user) {
  const users = readAll();
  const idx = users.findIndex(u => u.email === user.email);
  if (idx >= 0) users[idx] = user; else users.push(user);
  writeAll(users);
}
async function getUserByEmail(email) { return readAll().find(u => u.email === email) || null; }
async function getUserByNickname(nickname) { return readAll().find(u => u.nickname.toLowerCase() === nickname.toLowerCase()) || null; }
async function getAllUsers() { return readAll(); }
async function count() { return readAll().length; }

module.exports = { upsertUser, getUserByEmail, getUserByNickname, getAllUsers, count };
