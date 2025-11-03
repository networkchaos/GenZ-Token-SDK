import { Router } from 'express'
import { z } from 'zod'

export const depositsRouter = Router()

const StkSchema = z.object({ phone: z.string().min(9), amountKES: z.number().positive() })

// Placeholder handler for STK push initiation
depositsRouter.post('/initiate-stk', (req, res) => {
  const parsed = StkSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues })
  // Here you would trigger STK push via your provider. For now, simulate.
  return res.json({ status: 'initiated', reference: `stk_${Date.now()}` })
})


