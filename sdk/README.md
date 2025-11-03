# GenZ Token SDKs

Production-ready SDKs for integrating GenZ Tokens in games and services.

- JavaScript/TypeScript: `sdk/js` (Node 18+, servers/tools)
- Unity (C#): `sdk/unity`
- Unreal (C++): `sdk/unreal`
- Godot (GDScript): `sdk/godot`

These SDKs talk to your GenZ backend (issuer/gateway) via HTTPS. Use server-side API keys for minting/burning.

## JavaScript / TypeScript

Install (from `sdk/js`):

```bash
npm install @genz/sdk
```

Quick start:

```ts
import { GenZSDK } from '@genz/sdk'

const sdk = new GenZSDK({ baseUrl: 'https://api.genz.example.com', apiKey: process.env.GENZ_API_KEY as string })
await sdk.initialize()

await sdk.tokens.mint({ playerId: 'player_123', amount: 100, reason: 'quest' })
await sdk.tokens.transfer({ fromPlayerId: 'player_123', toPlayerId: 'player_456', amount: 50 })
const bal = await sdk.tokens.balance('player_456')
console.log(bal.balance)
```

## Unity (C#)

Copy `sdk/unity/GenZSDK.cs` into your project. Example:

```csharp
using GenZ;

var sdk = new GenZSDK(new GenZOptions {
  BaseUrl = "https://api.genz.example.com",
  ApiKey = "YOUR_API_KEY"
});
await sdk.Initialize();
await sdk.Tokens.Mint("player_123", 100, "quest");
```

## Unreal (C++)

Add `sdk/unreal/GenZSDK.h/.cpp` to your module and include headers.

```cpp
#include "GenZSDK.h"

FGenZOptions Options;
Options.BaseUrl = TEXT("https://api.genz.example.com");
Options.ApiKey = TEXT("YOUR_API_KEY");
auto* SDK = UGenZSDK::Create(Options);
SDK->Initialize();
SDK->Mint(TEXT("player_123"), 100);
```

## Godot (GDScript)

Copy `sdk/godot/GenZSDK.gd` into your project and use:

```gdscript
var sdk := GenZSDK.new("https://api.genz.example.com", "YOUR_API_KEY")
await sdk.initialize()
var res = await sdk.mint("player_123", 100, "quest")
```

## Notes

- Mint/burn operations generally require privileged backend keys. Use these SDKs from secure server contexts or trusted game servers.
- All SDKs implement retries with exponential backoff and timeouts.
- The API paths (`/v1/...`) assume a GenZ backend service that bridges to on-chain `GenZToken`.

