import { createError } from 'h3'
import { query } from '../db/client'
import { hashIp, isSafeHttpUrl } from '../utils/security'
import { buildDestinationUrl } from './urlService'

export function decodeClickToken(token: string) {
  try {
    const value = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'))
    if (!value.adId || !value.placementId) return null
    return value as { adId: string; placementId: string }
  } catch {
    return null
  }
}

export async function recordEvent(input: {
  property_id: string
  placement_id: string
  advertiser_id: string
  campaign_id: string
  ad_id: string
  event_type: 'impression' | 'click'
  page_url?: string | null
  referrer?: string | null
  user_agent?: string | null
  ip?: string | null
  metadata?: Record<string, unknown>
}) {
  const ipHash = input.ip ? hashIp(input.ip) : null
  await query(
    `INSERT INTO ad_events
      (property_id, placement_id, advertiser_id, campaign_id, ad_id, event_type, page_url, referrer, user_agent, ip_hash, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      input.property_id,
      input.placement_id,
      input.advertiser_id,
      input.campaign_id,
      input.ad_id,
      input.event_type,
      input.page_url,
      input.referrer,
      input.user_agent,
      ipHash,
      input.metadata || {}
    ]
  )
  await updateDailyStats(input)
}

export async function updateDailyStats(input: {
  property_id: string
  placement_id: string
  advertiser_id: string
  campaign_id: string
  ad_id: string
  event_type: 'impression' | 'click'
}) {
  const impressionInc = input.event_type === 'impression' ? 1 : 0
  const clickInc = input.event_type === 'click' ? 1 : 0
  await query(
    `INSERT INTO daily_ad_stats
      (date, property_id, placement_id, advertiser_id, campaign_id, ad_id, impressions, clicks, ctr)
     VALUES (current_date, $1,$2,$3,$4,$5,$6,$7, CASE WHEN $6 > 0 THEN $7::numeric / $6 ELSE 0 END)
     ON CONFLICT (date, property_id, placement_id, advertiser_id, campaign_id, ad_id)
     DO UPDATE SET
       impressions = daily_ad_stats.impressions + EXCLUDED.impressions,
       clicks = daily_ad_stats.clicks + EXCLUDED.clicks,
       ctr = CASE
         WHEN daily_ad_stats.impressions + EXCLUDED.impressions > 0
         THEN (daily_ad_stats.clicks + EXCLUDED.clicks)::numeric / (daily_ad_stats.impressions + EXCLUDED.impressions)
         ELSE 0
       END,
       updated_at = now()`,
    [input.property_id, input.placement_id, input.advertiser_id, input.campaign_id, input.ad_id, impressionInc, clickInc]
  )
}

export async function resolveClick(token: string) {
  const decoded = decodeClickToken(token)
  if (!decoded) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Click not found.' })

  const result = await query<any>(
    `SELECT ads.*, placements.id AS placement_id,
       properties.utm_source AS property_utm_source, properties.utm_medium AS property_utm_medium,
       properties.utm_campaign AS property_utm_campaign, properties.utm_content AS property_utm_content,
       properties.utm_term AS property_utm_term
     FROM ads
     JOIN placements ON placements.id = $2
     JOIN properties ON properties.id = ads.property_id
     WHERE ads.id = $1 LIMIT 1`,
    [decoded.adId, decoded.placementId]
  )
  const ad = result.rows[0]
  if (!ad) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Click not found.' })

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
  if (!isSafeHttpUrl(destination)) throw createError({ statusCode: 400, statusMessage: 'UNSAFE_URL', message: 'Unsafe destination.' })

  return { ad, placementId: decoded.placementId, destination }
}
