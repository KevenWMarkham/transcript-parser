import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../config/database'
import { users } from '../models/schema'
import { env } from '../config/env'
import { AuthRequest } from '../middleware/auth'

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email))
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name
    }).returning()

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id

    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId))

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
}
