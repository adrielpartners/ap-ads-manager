import { query } from '../db/client'

export async function listCampaigns() {
  const result = await query(
    `SELECT campaigns.*, advertisers.name AS advertiser_name, properties.name AS property_name
     FROM campaigns
     JOIN advertisers ON advertisers.id = campaigns.advertiser_id
     JOIN properties ON properties.id = campaigns.property_id
     ORDER BY campaigns.created_at DESC`
  )
  return result.rows
}

export async function getCampaign(id: string) {
  const result = await query(`SELECT * FROM campaigns WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function createCampaign(input: any) {
  const result = await query(
    `INSERT INTO campaigns (advertiser_id, property_id, name, start_date, end_date, status, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [input.advertiser_id, input.property_id, input.name, input.start_date, input.end_date, input.status || 'draft', input.notes]
  )
  return result.rows[0]
}

export async function updateCampaign(id: string, input: any) {
  const result = await query(
    `UPDATE campaigns SET advertiser_id=$2, property_id=$3, name=$4, start_date=$5, end_date=$6,
       status=$7, notes=$8, updated_at=now()
     WHERE id=$1 RETURNING *`,
    [id, input.advertiser_id, input.property_id, input.name, input.start_date, input.end_date, input.status || 'draft', input.notes]
  )
  return result.rows[0] || null
}
