import argon2 from 'argon2'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'
import { query } from '../db/client'
import { randomToken, sha256 } from '../utils/security'

const cookieName = 'ap_ads_session'
const sessionDays = 14

export type AuthUser = {
  id: string
  email: string
  role: 'owner' | 'admin' | 'client' | 'viewer'
}

export async function login(event: any, email: string, password: string) {
  const userResult = await query<any>(
    `SELECT id, email, password_hash, role, status FROM users WHERE lower(email) = lower($1) LIMIT 1`,
    [email]
  )
  const user = userResult.rows[0]
  if (!user || user.status !== 'active' || !(await argon2.verify(user.password_hash, password))) {
    throw createError({ statusCode: 401, statusMessage: 'INVALID_LOGIN', message: 'Invalid email or password.' })
  }

  const token = randomToken()
  const tokenHash = sha256(token)
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000)

  await query(`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`, [
    user.id,
    tokenHash,
    expiresAt
  ])

  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  })

  return { id: user.id, email: user.email, role: user.role } satisfies AuthUser
}

export async function logout(event: any) {
  const token = getCookie(event, cookieName)
  if (token) await query(`DELETE FROM sessions WHERE token_hash = $1`, [sha256(token)])
  deleteCookie(event, cookieName, { path: '/' })
}

export async function currentUser(event: any): Promise<AuthUser | null> {
  const token = getCookie(event, cookieName)
  if (!token) return null

  const result = await query<any>(
    `SELECT users.id, users.email, users.role
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1
       AND sessions.expires_at > now()
       AND users.status = 'active'
     LIMIT 1`,
    [sha256(token)]
  )

  return result.rows[0] || null
}

export async function requireOwner(event: any) {
  const user = await currentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'AUTH_REQUIRED', message: 'Please log in.' })
  if (user.role !== 'owner') throw createError({ statusCode: 403, statusMessage: 'FORBIDDEN', message: 'You do not have access.' })
  return user
}
