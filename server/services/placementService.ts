import { query } from '../db/client'

export async function listPlacements(propertyId: string) {
  const result = await query(`SELECT * FROM placements WHERE property_id = $1 ORDER BY created_at DESC`, [propertyId])
  return result.rows
}

export async function listAllPlacements() {
  const result = await query(
    `SELECT placements.*, properties.name AS property_name
     FROM placements JOIN properties ON properties.id = placements.property_id
     ORDER BY placements.created_at DESC`
  )
  return result.rows
}

export async function createPlacement(propertyId: string, input: any) {
  const result = await query(
    `INSERT INTO placements (property_id, name, slug, description, width, height, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [propertyId, input.name, input.slug, input.description, input.width, input.height, input.status || 'active']
  )
  return result.rows[0]
}

export async function updatePlacement(id: string, input: any) {
  const result = await query(
    `UPDATE placements SET name=$2, slug=$3, description=$4, width=$5, height=$6, status=$7, updated_at=now()
     WHERE id=$1 RETURNING *`,
    [id, input.name, input.slug, input.description, input.width, input.height, input.status || 'active']
  )
  return result.rows[0] || null
}
