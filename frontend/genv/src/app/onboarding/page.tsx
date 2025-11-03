"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type CompanyForm = {
  companyName: string
  registrationNumber: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<CompanyForm>({
    companyName: "",
    registrationNumber: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })
  const [depositAmount, setDepositAmount] = useState(1000)
  const [status, setStatus] = useState<string>("")

  const next = () => setStep((s) => (s === 1 ? 2 : 3))
  const prev = () => setStep((s) => (s === 3 ? 2 : 1))

  async function handleRegister() {
    setLoading(true)
    setStatus("")
    try {
      // In production, call your backend to create the company & issue API key
      await new Promise((r) => setTimeout(r, 600))
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  async function handleStkPush() {
    setLoading(true)
    setStatus("")
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      const res = await fetch(`${base}/v1/deposits/initiate-stk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: company.contactPhone, amountKES: depositAmount }),
      })
      if (!res.ok) throw new Error('Failed to initiate STK push')
      const json = await res.json()
      setStatus("STK push sent. Approve on your phone to complete the initial funding.")
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="container px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Onboard to GenZ Token SDK</h1>
        <p className="text-muted-foreground mb-8">
          Create your company account, fund with KES, and get your GENZ minting API keys.
        </p>
        <button className="mb-6 text-sm underline hover:opacity-80" onClick={() => router.back()}>
          ← Back
        </button>

        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className={`px-2 py-1 rounded ${step >= 1 ? 'bg-neon-blue/20 text-neon-blue' : 'bg-secondary text-secondary-foreground'}`}>1. Company</span>
          <span>→</span>
          <span className={`px-2 py-1 rounded ${step >= 2 ? 'bg-neon-blue/20 text-neon-blue' : 'bg-secondary text-secondary-foreground'}`}>2. Initial Deposit</span>
          <span>→</span>
          <span className={`px-2 py-1 rounded ${step >= 3 ? 'bg-neon-blue/20 text-neon-blue' : 'bg-secondary text-secondary-foreground'}`}>3. API Keys</span>
        </div>

        {step === 1 && (
          <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm mb-1">Company name</label>
              <input className="w-full px-3 py-2 rounded bg-background border" value={company.companyName} onChange={(e) => setCompany({ ...company, companyName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Registration number</label>
              <input className="w-full px-3 py-2 rounded bg-background border" value={company.registrationNumber} onChange={(e) => setCompany({ ...company, registrationNumber: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Contact name</label>
                <input className="w-full px-3 py-2 rounded bg-background border" value={company.contactName} onChange={(e) => setCompany({ ...company, contactName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact email</label>
                <input type="email" className="w-full px-3 py-2 rounded bg-background border" value={company.contactEmail} onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Contact phone (M-Pesa)</label>
              <input className="w-full px-3 py-2 rounded bg-background border" placeholder="07XXXXXXXX" value={company.contactPhone} onChange={(e) => setCompany({ ...company, contactPhone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded bg-secondary hover:bg-secondary/80" onClick={handleRegister} disabled={loading}>
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Fund your KES reserve to mint GENZ. We’ll send an STK push to your phone.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input className="w-full px-3 py-2 rounded bg-background border" value={company.contactPhone} onChange={(e) => setCompany({ ...company, contactPhone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount (KES)</label>
                <input type="number" className="w-full px-3 py-2 rounded bg-background border" value={depositAmount} onChange={(e) => setDepositAmount(parseInt(e.target.value || '0'))} />
              </div>
            </div>
            {status && <div className="text-sm text-neon-blue">{status}</div>}
            <div className="flex justify-between gap-3">
              <button className="px-4 py-2 rounded bg-secondary hover:bg-secondary/80" onClick={prev}>Back</button>
              <button className="px-4 py-2 rounded bg-neon-blue text-primary-foreground hover:bg-neon-blue/90" onClick={handleStkPush} disabled={loading}>
                {loading ? 'Sending...' : 'Send STK Push'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Your API keys</h2>
            <p className="text-sm text-muted-foreground">Use these keys in your server to mint GENZ after deposits settle.</p>
            <div className="p-3 rounded bg-background border text-sm">
              <div><span className="text-muted-foreground">Public key:</span> <code>pk_live_...</code></div>
              <div><span className="text-muted-foreground">Secret key:</span> <code>sk_live_...</code></div>
            </div>
            <div className="text-sm text-muted-foreground">Next: integrate the SDK, set your baseUrl to the backend, and start minting.</div>
          </div>
        )}
      </div>
    </div>
  )
}


