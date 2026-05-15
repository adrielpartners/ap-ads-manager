import { createError, getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { updateCampaign } from '../../services/campaignService'
import { campaignSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(campaignSchema, await readBody(event))
  const campaign = await updateCampaign(getRouterParam(event, 'id') || '', input)
  if (!campaign) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Campaign not found.' })
  return ok({ campaign })
})
