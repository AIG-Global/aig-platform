// ============================================================
// lib/store.js — Minimal embedded JSON datastore.
//
// No external dependencies (no SQLite driver, no ORM). Built on
// Node's fs module with atomic writes (write to temp file, then
// rename) so a crash mid-write never corrupts data on disk.
//
// This is intentionally simple: every "table" is a JSON file
// holding an array of records. For ONE's current scale (a single
// company's admin/monitoring backend) this is fast enough and has
// zero moving parts. The data-access layer (services/*.js) is the
// seam where this could later be swapped for Postgres/SQLite
// without touching routes or business logic.
// ============================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function readTable(table) {
  const fp = filePath(table);
  if (!fs.existsSync(fp)) return [];
  const raw = fs.readFileSync(fp, 'utf8').trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Corrupt file — back it up rather than silently losing data.
    const backupPath = fp + '.corrupt-' + Date.now();
    fs.copyFileSync(fp, backupPath);
    console.error(`[store] ${table}.json was corrupt — backed up to ${backupPath}`);
    return [];
  }
}

function writeTable(table, records) {
  const fp = filePath(table);
  const tmp = fp + '.tmp-' + process.pid + '-' + Date.now();
  fs.writeFileSync(tmp, JSON.stringify(records, null, 2));
  fs.renameSync(tmp, fp); // atomic on POSIX filesystems
}

function id(prefix = '') {
  return (prefix ? prefix + '_' : '') + crypto.randomBytes(9).toString('base64url');
}

function nowISO() {
  return new Date().toISOString();
}

// ---- simple in-process write queue per table to avoid lost updates
// when multiple requests mutate the same table concurrently ----
const queues = new Map();
function withTableLock(table, fn) {
  const prev = queues.get(table) || Promise.resolve();
  const next = prev.then(fn, fn); // run fn regardless of previous outcome
  queues.set(table, next.catch(() => {})); // keep the chain alive even on error
  return next;
}

const Store = {
  /** Return a shallow copy of every record in a table. */
  all(table) {
    return readTable(table);
  },

  /** Find records matching a predicate. */
  find(table, predicate) {
    return readTable(table).filter(predicate);
  },

  /** Find the first record matching a predicate, or undefined. */
  findOne(table, predicate) {
    return readTable(table).find(predicate);
  },

  /** Get a record by id. */
  get(table, recordId) {
    return readTable(table).find((r) => r.id === recordId);
  },

  /**
   * Insert a new record, auto-assigning id/createdAt if absent.
   * Pass maxRecords for high-volume append-only tables (e.g.
   * usage_events) to cap unbounded growth — once the cap is hit,
   * the oldest record is dropped to make room. Tables holding
   * authoritative records (users, payments, admin_actions) should
   * never pass this; audit/financial history must not be silently
   * truncated.
   */
  async insert(table, record, { maxRecords } = {}) {
    return withTableLock(table, () => {
      const records = readTable(table);
      const toInsert = {
        id: record.id || id(table),
        createdAt: record.createdAt || nowISO(),
        ...record,
      };
      records.push(toInsert);
      if (maxRecords && records.length > maxRecords) {
        records.splice(0, records.length - maxRecords);
      }
      writeTable(table, records);
      return toInsert;
    });
  },

  /** Update a record by id with a partial patch. Returns the updated record or null. */
  async update(table, recordId, patch) {
    return withTableLock(table, () => {
      const records = readTable(table);
      const idx = records.findIndex((r) => r.id === recordId);
      if (idx === -1) return null;
      records[idx] = { ...records[idx], ...patch, updatedAt: nowISO() };
      writeTable(table, records);
      return records[idx];
    });
  },

  /** Delete a record by id. Returns true if a record was removed. */
  async remove(table, recordId) {
    return withTableLock(table, () => {
      const records = readTable(table);
      const next = records.filter((r) => r.id !== recordId);
      const removed = next.length !== records.length;
      if (removed) writeTable(table, next);
      return removed;
    });
  },

  /** Replace an entire table's contents (used by seed scripts). */
  async replaceAll(table, records) {
    return withTableLock(table, () => {
      writeTable(table, records);
      return records;
    });
  },

  id,
  nowISO,
};

module.exports = Store;
