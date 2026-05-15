import { getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../../utils/api'
import { requireOwner } from '../../../services/authService'
import { createPlacement } from '../../../services/placementService'
import { placementSchema } from '../../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(placementSchema, await readBody(event))
  return ok({ placement: await createPlacement(getRouterParam(event, 'propertyId') || '', input) })
})
