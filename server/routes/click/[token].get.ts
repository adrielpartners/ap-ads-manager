import { getHeader, getQuery, getRouterParam, sendRedirect } from 'h3'
import { getClientIp } from '../../utils/api'
import { recordEvent, resolveClick } from '../../services/trackingService'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token') || ''
  const { ad, placementId, destination } = await resolveClick(token)
  const query = getQuery(event)

  await recordEvent({
    property_id: ad.property_id,
    placement_id: placementId,
    advertiser_id: ad.advertiser_id,
    campaign_id: ad.campaign_id,
    ad_id: ad.id,
    event_type: 'click',
    page_url: query.page_url ? String(query.page_url) : null,
    referrer: getHeader(event, 'referer'),
    user_agent: getHeader(event, 'user-agent'),
    ip: getClientIp(event)
  })

  return sendRedirect(event, destination, 302)
})
