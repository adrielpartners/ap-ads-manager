import { query } from '../db/client'
import { normalizeDomain } from '../utils/api'

export type PropertyInput = {
  name: string
  slug: string
  primary_domain: string
  allowed_domains?: string[]
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
  status?: 'active' | 'paused'
}

export async function listProperties() {
  const result = await query(`SELECT * FROM properties ORDER BY created_at DESC`)
  return result.rows
}

export async function getProperty(id: string) {
  const result = await query(`SELECT * FROM properties WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function findPropertyForPublic(domain: string, slug?: string) {
  const normalized = normalizeDomain(domain)
  const values: unknown[] = [normalized]
  let sql = `SELECT * FROM properties WHERE status = 'active' AND (primary_domain = $1 OR $1 = ANY(allowed_domains))`
  if (slug) {
    values.push(slug)
    sql += ` AND slug = $2`
  }
  sql += ` ORDER BY created_at ASC LIMIT 1`
  const result = await query(sql, values)
  return result.rows[0] || null
}

export async function createProperty(input: PropertyInput) {
  const result = await query(
    `INSERT INTO properties
      (name, slug, primary_domain, allowed_domains, utm_source, utm_medium, utm_campaign, utm_content, utm_term, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      input.name,
      input.slug,
      normalizeDomain(input.primary_domain),
      (input.allowed_domains || []).map(normalizeDomain),
      input.utm_source,
      input.utm_medium,
      input.utm_campaign,
      input.utm_content,
      input.utm_term,
      input.status || 'active'
    ]
  )
  return result.rows[0]
}

export async function updateProperty(id: string, input: PropertyInput) {
  const result = await query(
    `UPDATE properties SET
       name=$2, slug=$3, primary_domain=$4, allowed_domains=$5,
       utm_source=$6, utm_medium=$7, utm_campaign=$8, utm_content=$9, utm_term=$10,
       status=$11, updated_at=now()
     WHERE id=$1 RETURNING *`,
    [
      id,
      input.name,
      input.slug,
      normalizeDomain(input.primary_domain),
      (input.allowed_domains || []).map(normalizeDomain),
      input.utm_source,
      input.utm_medium,
      input.utm_campaign,
      input.utm_content,
      input.utm_term,
      input.status || 'active'
    ]
  )
  return result.rows[0] || null
}
