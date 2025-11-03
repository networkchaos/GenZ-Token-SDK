import Database from 'better-sqlite3'

const db = new Database(process.env.SQLITE_PATH || 'genz.db')

db.exec(`
  PRAGMA journal_mode=WAL;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS deposits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount_kes INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS redemptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount_kes INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS mints (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount_wei TEXT NOT NULL,
    tx_hash TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS burns (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount_wei TEXT NOT NULL,
    tx_hash TEXT,
    created_at INTEGER NOT NULL
  );
`)

export const ledger = {
  recordDeposit(deposit: { id: string; userId: string; amountKES: number; status: string }) {
    db.prepare('INSERT OR REPLACE INTO deposits (id, user_id, amount_kes, status, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(deposit.id, deposit.userId, deposit.amountKES, deposit.status, Date.now())
  },
  recordMint(mint: { id: string; userId: string; amountWei: string; txHash?: string }) {
    db.prepare('INSERT OR REPLACE INTO mints (id, user_id, amount_wei, tx_hash, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(mint.id, mint.userId, mint.amountWei, mint.txHash ?? null, Date.now())
  },
}


