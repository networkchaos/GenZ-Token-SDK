import type { Request, Response, NextFunction } from 'express'

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const provided = req.header('Authorization') || ''
  const token = provided.startsWith('Bearer ') ? provided.slice(7) : provided
  const expected = process.env.ADMIN_API_KEY || ''
  if (!expected) {
    return res.status(500).json({ message: 'Server misconfigured: ADMIN_API_KEY missing' })
  }
  if (token !== expected) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}


