import argon2 from 'argon2'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_URL
const email = process.env.OWNER_EMAIL
const password = process.env.OWNER_PASSWORD

if (!databaseUrl || !email || !password) {
  throw new Error('DATABASE_URL, OWNER_EMAIL, and OWNER_PASSWORD are required')
}

const pool = new pg.Pool({ connectionString: databaseUrl })
const passwordHash = await argon2.hash(password)

await pool.query(
  `INSERT INTO users (email, password_hash, role)
   VALUES ($1, $2, 'owner')
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()`,
  [email.toLowerCase(), passwordHash]
)

await pool.end()
console.log(`Owner ready: ${email}`)
