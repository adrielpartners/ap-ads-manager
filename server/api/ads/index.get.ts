import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { listAds } from '../../services/adService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  return ok({ ads: await listAds() })
})
