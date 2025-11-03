# GenZ Backend

Issuer backend for GENZ: KYC, ledger, mint/burn orchestration, and fiat rails via Pretium API.

- API key auth: set `ADMIN_API_KEY`.
- Ledger: SQLite (WAL) stored at `SQLITE_PATH`.
- Fiat rails: Pretium STABLES-to-FIAT API.
- On-chain: uses `GENZ_MINTER_PRIVATE_KEY` to call `mint` on `TOKEN_ADDRESS`.

## Run

```bash
cd backend
npm install
npm run dev
```

Set environment:

```bash
# Create .env and set variables
# If .env.sample is unavailable, set variables manually as per README
```

## Endpoints

- GET `/v1/health` → `{ status: 'ok' }`
- POST `/v1/tokens/mint` (auth)
  - body: `{ userId, to, amountWei, reason? }`
- POST `/v1/tokens/transfer` (auth) → 501 placeholder
- GET `/v1/wallets/:playerId/balance?address=0x...` (auth)
- POST `/v1/webhooks/pretium` → Pretium events (deposit.settled, payout.settled)

## Pretium

Follow the STABLES-to-FIAT guide to configure payout and webhook events. Reference:
- [STABLES-to-FIAT (Pretium open APIs)](https://github.com/derrickbundi/pretium-v1-open-apis/blob/master/STABLES-to-FIAT.MD)

## Notes

- Mint only after fiat deposit is settled (via webhook).
- Redemption: burn then initiate `payoutToBank()`.
- Secure admin endpoints behind `ADMIN_API_KEY` and consider IP allowlisting.

