import { getRouterParam } from 'h3'
import { ok } from '../../../utils/api'
import { requireOwner } from '../../../services/authService'
import { listPlacements } from '../../../services/placementService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  return ok({ placements: await listPlacements(getRouterParam(event, 'propertyId') || '') })
})
