import { query } from '../db/client'
import { buildDestinationUrl } from './urlService'

export async function listAds() {
  const result = await query(
    `SELECT ads.*, campaigns.name AS campaign_name, advertisers.name AS advertiser_name, properties.name AS property_name
     FROM ads
     JOIN campaigns ON campaigns.id = ads.campaign_id
     JOIN advertisers ON advertisers.id = ads.advertiser_id
     JOIN properties ON properties.id = ads.property_id
     ORDER BY ads.created_at DESC`
  )
  return result.rows
}

export async function getAd(id: string) {
  const result = await query(`SELECT * FROM ads WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function createAd(input: any) {
  const result = await query(
    `INSERT INTO ads
      (campaign_id, advertiser_id, property_id, name, destination_url, alt_text, status, start_date, end_date, weight,
       utm_source, utm_medium, utm_campaign, utm_content, utm_term)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [
      input.campaign_id,
      input.advertiser_id,
      input.property_id,
      input.name,
      input.destination_url,
      input.alt_text,
      input.status || 'draft',
      input.start_date,
      input.end_date,
      input.weight || 1,
      input.utm_source,
      input.utm_medium,
      input.utm_campaign,
      input.utm_content,
      input.utm_term
    ]
  )
  return result.rows[0]
}

export async function updateAd(id: string, input: any) {
  const result = await query(
    `UPDATE ads SET campaign_id=$2, advertiser_id=$3, property_id=$4, name=$5, destination_url=$6,
       alt_text=$7, status=$8, start_date=$9, end_date=$10, weight=$11,
       utm_source=$12, utm_medium=$13, utm_campaign=$14, utm_content=$15, utm_term=$16, updated_at=now()
     WHERE id=$1 RETURNING *`,
    [
      id,
      input.campaign_id,
      input.advertiser_id,
      input.property_id,
      input.name,
      input.destination_url,
      input.alt_text,
      input.status || 'draft',
      input.start_date,
      input.end_date,
      input.weight || 1,
      input.utm_source,
      input.utm_medium,
      input.utm_campaign,
      input.utm_content,
      input.utm_term
    ]
  )
  return result.rows[0] || null
}

export async function setAdImage(id: string, imagePath: string, imageUrl: string) {
  const result = await query(
    `UPDATE ads SET image_path=$2, image_url=$3, updated_at=now() WHERE id=$1 RETURNING *`,
    [id, imagePath, imageUrl]
  )
  return result.rows[0] || null
}

export async function setAdPlacements(adId: string, placementIds: string[]) {
  await query(`DELETE FROM ad_placement_assignments WHERE ad_id = $1`, [adId])
  for (const placementId of placementIds) {
    await query(
      `INSERT INTO ad_placement_assignments (ad_id, placement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [adId, placementId]
    )
  }
  return getAd(adId)
}

export function chooseWeightedAd<T extends { weight: number }>(ads: T[], random = Math.random) {
  const total = ads.reduce((sum, ad) => sum + Math.max(0, Number(ad.weight) || 0), 0)
  if (!ads.length || total <= 0) return null
  let threshold = random() * total
  for (const ad of ads) {
    threshold -= Math.max(0, Number(ad.weight) || 0)
    if (threshold <= 0) return ad
  }
  return ads[ads.length - 1]
}

export async function selectPublicAd(input: { domain: string; slot: string; propertySlug?: string; pageUrl?: string }) {
  const { findPropertyForPublic } = await import('./propertyService')
  const property = await findPropertyForPublic(input.domain, input.propertySlug)
  if (!property) return null

  const result = await query<any>(
    `SELECT ads.*, placements.id AS placement_id, advertisers.name AS advertiser_name,
       properties.utm_source AS property_utm_source, properties.utm_medium AS property_utm_medium,
       properties.utm_campaign AS property_utm_campaign, properties.utm_content AS property_utm_content,
       properties.utm_term AS property_utm_term
     FROM placements
     JOIN ad_placement_assignments assignments ON assignments.placement_id = placements.id
     JOIN ads ON ads.id = assignments.ad_id
     JOIN campaigns ON campaigns.id = ads.campaign_id
     JOIN advertisers ON advertisers.id = ads.advertiser_id
     JOIN properties ON properties.id = ads.property_id
     WHERE placements.property_id = $1
       AND placements.slug = $2
       AND placements.status = 'active'
       AND ads.status = 'active'
       AND campaigns.status = 'active'
       AND (ads.start_date IS NULL OR ads.start_date <= current_date)
       AND (ads.end_date IS NULL OR ads.end_date >= current_date)
       AND (campaigns.start_date IS NULL OR campaigns.start_date <= current_date)
       AND (campaigns.end_date IS NULL OR campaigns.end_date >= current_date)
       AND ads.image_url IS NOT NULL`,
    [property.id, input.slot]
  )

  const ad = chooseWeightedAd(result.rows)
  if (!ad) return null

  const destination = buildDestinationUrl(
    ad.destination_url,
    {
      utm_source: ad.property_utm_source,
      utm_medium: ad.property_utm_medium,
      utm_campaign: ad.property_utm_campaign,
      utm_content: ad.property_utm_content,
      utm_term: ad.property_utm_term
    },
    ad
  )
  const clickToken = Buffer.from(JSON.stringify({ adId: ad.id, placementId: ad.placement_id })).toString('base64url')
  const config = useRuntimeConfig()

  return {
    tracking_id: clickToken,
    property_id: ad.property_id,
    placement_id: ad.placement_id,
    advertiser_id: ad.advertiser_id,
    campaign_id: ad.campaign_id,
    ad_id: ad.id,
    image_url: ad.image_url,
    click_url: `${config.appBaseUrl}/click/${clickToken}`,
    destination_url: destination,
    alt_text: ad.alt_text || ad.advertiser_name || ad.name
  }
}
