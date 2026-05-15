import { getQuery } from 'h3'
import { ok } from '../../utils/api'
import { selectPublicAd } from '../../services/adService'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slot = String(query.slot || '')
  const domain = String(query.domain || '')
  const propertySlug = query.property ? String(query.property) : undefined
  if (!slot || !domain) return ok({ ad: null })

  const ad = await selectPublicAd({ slot, domain, propertySlug, pageUrl: query.page_url ? String(query.page_url) : undefined })
  return ok({ ad })
})
