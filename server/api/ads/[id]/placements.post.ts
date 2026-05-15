import { getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../../utils/api'
import { requireOwner } from '../../../services/authService'
import { setAdPlacements } from '../../../services/adService'
import { assignmentSchema } from '../../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(assignmentSchema, await readBody(event))
  return ok({ ad: await setAdPlacements(getRouterParam(event, 'id') || '', input.placement_ids) })
})
