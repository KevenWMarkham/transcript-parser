import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthRequest extends Request {
  user?: { id: number; email: string }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const user = jwt.verify(token, env.JWT_SECRET) as { id: number; email: string }
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' })
  }
}
