import { Router } from 'express'
import { createPretiumFromEnv } from '../services/pretiumClient.js'
import { ledger } from '../services/ledger.js'

export const webhooksRouter = Router()

// Receive Pretium events for deposits/redemptions
webhooksRouter.post('/pretium', async (req, res) => {
  const client = createPretiumFromEnv()
  const raw = JSON.stringify(req.body)
  const ok = client.verifyWebhook(req.headers as any, raw)
  if (!ok) return res.status(400).json({ message: 'invalid signature' })

  const evt = req.body
  // Example event routing (adjust to actual Pretium payloads)
  if (evt.type === 'deposit.settled') {
    // mark deposit then allow admin to mint
    ledger.recordDeposit({ id: evt.data.id, userId: evt.data.user_id, amountKES: evt.data.amount_kes, status: 'settled' })
  }
  if (evt.type === 'payout.settled') {
    // redemption settled
  }
  return res.json({ received: true })
})


