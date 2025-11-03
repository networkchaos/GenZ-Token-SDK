"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DemoPage() {
  const [status, setStatus] = useState<string>("")
  const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("")
    const form = e.currentTarget
    const data = new FormData(form)
    data.append("access_key", apiKey)
    const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
    const json = await res.json()
    if (json.success) {
      setStatus("Thanks! We'll reach out shortly.")
      form.reset()
    } else {
      setStatus(json.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="container px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Request a Demo</h1>
        <p className="text-muted-foreground mb-8">Tell us about your game and goals. We'll schedule a walkthrough.</p>

        <button className="mb-6 text-sm underline hover:opacity-80" onClick={() => router.back()}>
          ← Back
        </button>

        <form onSubmit={onSubmit} className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input name="name" required className="w-full px-3 py-2 rounded bg-background border" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" name="email" required className="w-full px-3 py-2 rounded bg-background border" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Company</label>
              <input name="company" className="w-full px-3 py-2 rounded bg-background border" />
            </div>
            <div>
              <label className="block text-sm mb-1">Role</label>
              <input name="role" className="w-full px-3 py-2 rounded bg-background border" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea name="message" rows={4} className="w-full px-3 py-2 rounded bg-background border" placeholder="Tell us about your game, engine, scale, and timeline" />
          </div>
          {status && <div className="text-sm text-neon-blue">{status}</div>}
          <div className="flex justify-end">
            <button className="px-4 py-2 rounded bg-neon-blue text-primary-foreground hover:bg-neon-blue/90">Send</button>
          </div>
        </form>
      </div>
    </div>
  )
}


