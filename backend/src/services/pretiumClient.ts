import fetch from 'node-fetch'

export type PretiumClientOptions = {
  baseUrl: string
  apiKey: string
  timeoutMs?: number
}

export class PretiumClient {
  private baseUrl: string
  private apiKey: string
  private timeoutMs: number

  constructor(opts: PretiumClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '')
    this.apiKey = opts.apiKey
    this.timeoutMs = opts.timeoutMs ?? 10000
  }

  // Example: send KES to bank account (payout) to redeem GENZ
  async payoutToBank(params: { amountKES: number; accountNumber: string; bankCode?: string; reference?: string }) {
    const path = '/v1/fiat/payouts'
    return this.request('POST', path, {
      currency: 'KES',
      amount: params.amountKES,
      destination: {
        type: 'bank_account',
        account_number: params.accountNumber,
        bank_code: params.bankCode ?? 'KCB',
      },
      reference: params.reference ?? `redeem_${Date.now()}`,
    })
  }

  // Example webhook validation may include signature header in the real API
  verifyWebhook(_headers: Record<string, string>, _rawBody: string): boolean {
    return true
  }

  private async request(method: 'GET' | 'POST', path: string, body?: unknown) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
      const text = await res.text()
      const json = text ? JSON.parse(text) : undefined
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`)
      return json
    } finally {
      clearTimeout(timeout)
    }
  }
}

export function createPretiumFromEnv() {
  const baseUrl = process.env.PRETIUM_BASE_URL
  const apiKey = process.env.PRETIUM_API_KEY
  if (!baseUrl || !apiKey) throw new Error('Missing PRETIUM_BASE_URL or PRETIUM_API_KEY')
  return new PretiumClient({ baseUrl, apiKey })
}


