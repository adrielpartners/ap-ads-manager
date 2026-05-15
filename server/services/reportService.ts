import { query } from '../db/client'

export type ReportFilters = { start?: string; end?: string }

function dateClause(filters: ReportFilters, values: unknown[]) {
  const clauses: string[] = []
  if (filters.start) {
    values.push(filters.start)
    clauses.push(`date >= $${values.length}`)
  }
  if (filters.end) {
    values.push(filters.end)
    clauses.push(`date <= $${values.length}`)
  }
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
}

export async function overviewReport(filters: ReportFilters) {
  const values: unknown[] = []
  const where = dateClause(filters, values)
  const totals = await query<any>(
    `SELECT COALESCE(sum(impressions),0)::int AS impressions,
       COALESCE(sum(clicks),0)::int AS clicks,
       CASE WHEN COALESCE(sum(impressions),0) > 0 THEN sum(clicks)::numeric / sum(impressions) ELSE 0 END AS ctr
     FROM daily_ad_stats ${where}`,
    values
  )
  const activeAds = await query<any>(`SELECT count(*)::int AS count FROM ads WHERE status = 'active'`)
  const activeCampaigns = await query<any>(`SELECT count(*)::int AS count FROM campaigns WHERE status = 'active'`)
  return { ...totals.rows[0], active_ads: activeAds.rows[0].count, active_campaigns: activeCampaigns.rows[0].count }
}

export async function entityReport(entity: 'property' | 'advertiser' | 'campaign' | 'ad' | 'placement', id: string, filters: ReportFilters) {
  const column = `${entity}_id`
  const values: unknown[] = [id]
  const extra = dateClause(filters, values).replace('WHERE', 'AND')
  const result = await query<any>(
    `SELECT date, sum(impressions)::int AS impressions, sum(clicks)::int AS clicks,
       CASE WHEN sum(impressions) > 0 THEN sum(clicks)::numeric / sum(impressions) ELSE 0 END AS ctr
     FROM daily_ad_stats
     WHERE ${column} = $1 ${extra}
     GROUP BY date ORDER BY date DESC`,
    values
  )
  return result.rows
}

export async function exportCsv(filters: ReportFilters) {
  const values: unknown[] = []
  const where = dateClause(filters, values)
  const result = await query<any>(
    `SELECT date, property_id, placement_id, advertiser_id, campaign_id, ad_id, impressions, clicks, ctr
     FROM daily_ad_stats ${where} ORDER BY date DESC`,
    values
  )
  const header = ['date', 'property_id', 'placement_id', 'advertiser_id', 'campaign_id', 'ad_id', 'impressions', 'clicks', 'ctr']
  const rows = result.rows.map((row) => header.map((key) => csvCell(row[key])).join(','))
  return [header.join(','), ...rows].join('\n')
}

function csvCell(value: unknown) {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
