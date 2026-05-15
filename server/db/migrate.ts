import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required')

const pool = new pg.Pool({ connectionString: databaseUrl })

await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())')
const files = (await readdir('migrations')).filter((file) => file.endsWith('.sql')).sort()

for (const file of files) {
  const existing = await pool.query('SELECT filename FROM schema_migrations WHERE filename = $1', [file])
  if (existing.rowCount) continue
  const sql = await readFile(join('migrations', file), 'utf8')
  await pool.query('BEGIN')
  try {
    await pool.query(sql)
    await pool.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
    await pool.query('COMMIT')
    console.log(`Applied ${file}`)
  } catch (error) {
    await pool.query('ROLLBACK')
    throw error
  }
}

await pool.end()
