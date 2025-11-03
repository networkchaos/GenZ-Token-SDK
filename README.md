# GenZ Token SDK 

GenZ is a KES-backed stable token (GENZ) and developer platform that lets game studios integrate real-money token economies into their games using first-party SDKs for web, Unity, Unreal, and Godot. The token is fiat-backed: every GENZ in circulation is backed by Kenyan Shillings (KES) held in reserve.

## Why we are building this

- Games need a compliant, stable, low-friction currency for player rewards, purchases, and payouts.
- Most Kenyan players transact via KES; GENZ bridges web3 rails to the KES banking system.
- Studios need production-grade SDKs, docs, and a managed backend to mint/burn safely and reconcile fiat reserves with on-chain supply.

## What this repo includes

- `contracts/` — GENZ token smart contracts
  - `GenZTokenUpgradeable.sol` (UUPS upgradeable, ERC20 + Permit, roles, pausability)
- `backend/` — Issuer backend (TypeScript, Express)
  - API key auth, SQLite ledger, mint endpoint, deposit initiation, webhook receiver
  - Integrates with Pretium STABLES-to-FIAT rails for bank payouts and deposit webhooks
- `sdk/` — Production SDKs
  - `sdk/js` — TypeScript SDK (`@genz/sdk`) for servers/tools
  - `sdk/unity` — C# SDK
  - `sdk/unreal` — C++ SDK (UE HTTP module)
  - `sdk/godot` — GDScript SDK
- `frontend/genv/` — Next.js marketing site and onboarding
  - Onboarding flow (company details → initial deposit via STK push → API keys)
  - Docs site (`/docs`) with integration guides
  - Demo request form (`/demo`) powered by Web3Forms

## High-level architecture

1) Company registers and opens a KES custodial account to hold GENZ reserves.
2) Deposits arrive in KES → backend records and, when settled, mints GENZ on-chain to designated wallets.
3) Redemptions burn GENZ and pay out KES via banking rails (Pretium API integration).
4) SDKs provide simple APIs to mint/transfer/read balances and integrate with engines.

## Quick start

### Backend
```bash
cd backend
npm install
# Set required env: RPC_URL, TOKEN_ADDRESS, GENZ_MINTER_PRIVATE_KEY, ADMIN_API_KEY
# Optional: PRETIUM_BASE_URL, PRETIUM_API_KEY, SQLITE_PATH
npm run dev
# Health check
curl http://localhost:8080/v1/health
```

### Frontend
```bash
cd frontend/genv
npm install
# env
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
# NEXT_PUBLIC_WEB3FORMS_KEY=your-web3forms-key
npm run dev
# open http://localhost:3000
```

### JavaScript SDK
```ts
import { GenZSDK } from '@genz/sdk'

const sdk = new GenZSDK({ baseUrl: process.env.GENZ_API_URL!, apiKey: process.env.GENZ_API_KEY! })
await sdk.initialize()
await sdk.tokens.mint({ playerId: 'player_123', amount: 100, reason: 'quest' })
```

## Smart contracts

- `GenZTokenUpgradeable.sol` is UUPS upgradeable, with `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, and `PAUSER_ROLE`.
- Mint/burn actions are gated by roles; transfers can be paused for safety.

## Backend APIs (selected)

- `POST /v1/tokens/mint` — Mint GENZ after deposit settlement (server API key required)
- `GET /v1/wallets/:playerId/balance?address=0x...` — Read balance
- `POST /v1/deposits/initiate-stk` — Initiate initial KES funding during onboarding
- `POST /v1/webhooks/pretium` — Receive deposit/payout events from Pretium

## Documentation

- Full docs are available in the app at `/docs`.
- Pretium STABLES-to-FIAT open APIs reference: https://github.com/derrickbundi/pretium-v1-open-apis/blob/master/STABLES-to-FIAT.MD

## Security and compliance

- All admin and mint flows are server-side with API key auth.
- SQLite ledger demonstrates minimal bookkeeping; for production use a managed relational database and robust reconciliation.
- Consider KYC/AML policy enforcement endpoints before allowing mints.

## License

MIT

