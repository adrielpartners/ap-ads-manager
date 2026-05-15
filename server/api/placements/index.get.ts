import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { listAllPlacements } from '../../services/placementService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  return ok({ placements: await listAllPlacements() })
})
