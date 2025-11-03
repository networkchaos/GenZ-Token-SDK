export type GenZSDKOptions = {
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
  maxRetries?: number;
};

type HttpMethod = 'GET' | 'POST';

class HttpError extends Error {
  readonly status: number;
  readonly body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(opts: GenZSDKOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '');
    this.apiKey = opts.apiKey;
    this.timeoutMs = opts.timeoutMs ?? 10000;
    this.maxRetries = Math.max(0, opts.maxRetries ?? 2);
  }

  async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;

    const payload = body == null ? undefined : JSON.stringify(body);

    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(url, {
          method,
          headers,
          body: payload,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const text = await res.text();
        const json = text ? JSON.parse(text) : undefined;
        if (!res.ok) {
          // 5xx retryable, others throw immediately unless final attempt
          if (res.status >= 500 && attempt < this.maxRetries) {
            await this.sleep(this.backoffMs(attempt));
            continue;
          }
          throw new HttpError(json?.message ?? `HTTP ${res.status}`, res.status, json);
        }
        return json as T;
      } catch (err: any) {
        clearTimeout(timeout);
        lastErr = err;
        const isAbort = err?.name === 'AbortError';
        const isNetwork = err?.code === 'ECONNRESET' || err?.code === 'ENOTFOUND' || err?.name === 'TypeError';
        if ((isAbort || isNetwork) && attempt < this.maxRetries) {
          await this.sleep(this.backoffMs(attempt));
          continue;
        }
        throw err;
      }
    }
    // Should never reach here
    throw lastErr instanceof Error ? lastErr : new Error('Request failed');
  }

  private backoffMs(attempt: number): number {
    const base = 300 * 2 ** attempt;
    const jitter = Math.floor(Math.random() * 200);
    return Math.min(3000, base + jitter);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}

export type MintRequest = {
  playerId: string;
  amount: number;
  reason?: string;
};

export type TransferRequest = {
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
};

export type BalanceResponse = {
  playerId: string;
  balance: string; // as string to avoid precision loss
};

class TokensApi {
  constructor(private readonly http: HttpClient) {}

  mint(req: MintRequest) {
    if (!req.playerId) throw new Error('playerId is required');
    if (!Number.isFinite(req.amount) || req.amount <= 0) throw new Error('amount must be positive');
    return this.http.request<{ transactionId: string }>('POST', `/v1/tokens/mint`, req);
  }

  transfer(req: TransferRequest) {
    if (!req.fromPlayerId || !req.toPlayerId) throw new Error('fromPlayerId and toPlayerId are required');
    if (!Number.isFinite(req.amount) || req.amount <= 0) throw new Error('amount must be positive');
    return this.http.request<{ transactionId: string }>('POST', `/v1/tokens/transfer`, req);
  }

  balance(playerId: string) {
    if (!playerId) throw new Error('playerId is required');
    return this.http.request<BalanceResponse>('GET', `/v1/wallets/${encodeURIComponent(playerId)}/balance`);
  }
}

class EconomyApi {
  constructor(private readonly http: HttpClient) {}
  info() {
    return this.http.request<{ name: string; symbol: string; decimals: number }>('GET', `/v1/economy`);
  }
}

export class GenZSDK {
  readonly tokens: TokensApi;
  readonly economy: EconomyApi;
  private readonly http: HttpClient;

  constructor(options: GenZSDKOptions) {
    this.http = new HttpClient(options);
    this.tokens = new TokensApi(this.http);
    this.economy = new EconomyApi(this.http);
  }

  async initialize(): Promise<void> {
    // Optionally perform a health check or fetch economy info to warm caches
    await this.http.request('GET', '/v1/health');
  }
}

export { HttpError };

