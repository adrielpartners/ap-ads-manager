import { query } from '../db/client'

export async function listAdvertisers() {
  const result = await query(`SELECT * FROM advertisers ORDER BY created_at DESC`)
  return result.rows
}

export async function getAdvertiser(id: string) {
  const result = await query(`SELECT * FROM advertisers WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function createAdvertiser(input: any) {
  const result = await query(
    `INSERT INTO advertisers (name, contact_name, contact_email, contact_phone, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [input.name, input.contact_name, input.contact_email, input.contact_phone, input.notes, input.status || 'active']
  )
  return result.rows[0]
}

export async function updateAdvertiser(id: string, input: any) {
  const result = await query(
    `UPDATE advertisers SET name=$2, contact_name=$3, contact_email=$4, contact_phone=$5,
      notes=$6, status=$7, updated_at=now() WHERE id=$1 RETURNING *`,
    [id, input.name, input.contact_name, input.contact_email, input.contact_phone, input.notes, input.status || 'active']
  )
  return result.rows[0] || null
}
