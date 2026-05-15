import { readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { createCampaign } from '../../services/campaignService'
import { campaignSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(campaignSchema, await readBody(event))
  return ok({ campaign: await createCampaign(input) })
})
