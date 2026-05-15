import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { listAdvertisers } from '../../services/advertiserService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  return ok({ advertisers: await listAdvertisers() })
})
