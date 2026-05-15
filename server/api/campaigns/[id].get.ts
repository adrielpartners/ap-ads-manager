import { createError, getRouterParam } from 'h3'
import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { getCampaign } from '../../services/campaignService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const campaign = await getCampaign(getRouterParam(event, 'id') || '')
  if (!campaign) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Campaign not found.' })
  return ok({ campaign })
})
