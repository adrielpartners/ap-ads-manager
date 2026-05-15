import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { listCampaigns } from '../../services/campaignService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  return ok({ campaigns: await listCampaigns() })
})
