import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="container px-4 py-16 max-w-5xl">
        <h1 className="text-4xl font-bold mb-4">GenZ Token SDK Documentation</h1>
        <p className="text-muted-foreground mb-8">How to get started, integrate SDKs, and run the backend.</p>

        <nav className="mb-10 grid md:grid-cols-2 gap-4 text-sm">
          <a href="#getting-started" className="underline hover:opacity-80">Getting Started</a>
          <a href="#onboarding" className="underline hover:opacity-80">Onboarding & Initial Deposit</a>
          <a href="#backend" className="underline hover:opacity-80">Backend Setup</a>
          <a href="#sdk-js" className="underline hover:opacity-80">SDK: JavaScript</a>
          <a href="#sdk-unity" className="underline hover:opacity-80">SDK: Unity (C#)</a>
          <a href="#sdk-unreal" className="underline hover:opacity-80">SDK: Unreal (C++)</a>
          <a href="#sdk-godot" className="underline hover:opacity-80">SDK: Godot (GDScript)</a>
        </nav>

        <section id="getting-started" className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <p>1) Click <Link href="/onboarding" className="underline">Get Started</Link> to create your company and request your API keys.</p>
          <p>2) Make an initial KES deposit via STK push to back your GENZ tokens.</p>
          <p>3) Use the SDKs below to mint, transfer, and read balances for your players.</p>
        </section>

        <section id="onboarding" className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold">Onboarding & Initial Deposit</h2>
          <p>Provide company details and contact phone. We send an STK push for the initial KES funding. Once settled, your backend can mint GENZ to your game wallets.</p>
        </section>

        <section id="backend" className="space-y-4 mb-4">
          <h2 className="text-2xl font-semibold">Backend Setup</h2>
          <pre className="bg-card/50 border border-border/50 rounded p-4 overflow-x-auto text-sm"><code>{`cd backend
npm install
# set env: RPC_URL, TOKEN_ADDRESS, GENZ_MINTER_PRIVATE_KEY, ADMIN_API_KEY
# PRETIUM_BASE_URL, PRETIUM_API_KEY, SQLITE_PATH (optional)
npm run dev

# Health
curl http://localhost:8080/v1/health
`}</code></pre>
          <p className="text-sm text-muted-foreground">Endpoints consumed by SDKs:</p>
          <ul className="list-disc ml-6 text-sm text-muted-foreground">
            <li>POST /v1/tokens/mint (server API key required)</li>
            <li>POST /v1/tokens/transfer (optional, server-initiated)</li>
            <li>GET /v1/wallets/:playerId/balance?address=0x...</li>
            <li>POST /v1/deposits/initiate-stk (public, onboarding)</li>
          </ul>
        </section>

        <section id="sdk-js" className="space-y-3 mb-10">
          <h2 className="text-2xl font-semibold">SDK: JavaScript</h2>
          <pre className="bg-card/50 border border-border/50 rounded p-4 overflow-x-auto text-sm"><code>{`npm install @genz/sdk

import { GenZSDK } from '@genz/sdk'

const sdk = new GenZSDK({ baseUrl: process.env.GENZ_API_URL!, apiKey: process.env.GENZ_API_KEY! })
await sdk.initialize()

await sdk.tokens.mint({ playerId: 'player_123', amount: 100, reason: 'quest' })
const bal = await sdk.tokens.balance('player_123')
console.log(bal.balance)
`}</code></pre>
        </section>

        <section id="sdk-unity" className="space-y-3 mb-10">
          <h2 className="text-2xl font-semibold">SDK: Unity (C#)</h2>
          <pre className="bg-card/50 border border-border/50 rounded p-4 overflow-x-auto text-sm"><code>{`using GenZ;

var sdk = new GenZSDK(new GenZOptions {
  BaseUrl = "https://api.genz.example.com",
  ApiKey = "YOUR_API_KEY"
});
await sdk.Initialize();
await sdk.Tokens.Mint("player_123", 100, "quest");
`}</code></pre>
        </section>

        <section id="sdk-unreal" className="space-y-3 mb-10">
          <h2 className="text-2xl font-semibold">SDK: Unreal (C++)</h2>
          <pre className="bg-card/50 border border-border/50 rounded p-4 overflow-x-auto text-sm"><code>{`#include "GenZSDK.h"

FGenZOptions Options;
Options.BaseUrl = TEXT("https://api.genz.example.com");
Options.ApiKey = TEXT("YOUR_API_KEY");
auto* SDK = UGenZSDK::Create(Options);
SDK->Initialize();
SDK->Mint(TEXT("player_123"), 100);
`}</code></pre>
        </section>

        <section id="sdk-godot" className="space-y-3 mb-10">
          <h2 className="text-2xl font-semibold">SDK: Godot (GDScript)</h2>
          <pre className="bg-card/50 border border-border/50 rounded p-4 overflow-x-auto text-sm"><code>{`var sdk := GenZSDK.new("https://api.genz.example.com", "YOUR_API_KEY")
await sdk.initialize()
var res = await sdk.mint("player_123", 100, "quest")
`}</code></pre>
        </section>
      </div>
    </div>
  )
}


