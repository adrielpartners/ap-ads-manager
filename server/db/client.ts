import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | undefined

export function getDb() {
  const config = useRuntimeConfig()
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }
  pool ||= new Pool({ connectionString: config.databaseUrl })
  return pool
}

export async function query<T = any>(text: string, values: unknown[] = []) {
  return getDb().query<T>(text, values)
}
