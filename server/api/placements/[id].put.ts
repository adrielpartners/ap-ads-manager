import { createError, getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { updatePlacement } from '../../services/placementService'
import { placementSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(placementSchema, await readBody(event))
  const placement = await updatePlacement(getRouterParam(event, 'id') || '', input)
  if (!placement) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Placement not found.' })
  return ok({ placement })
})
