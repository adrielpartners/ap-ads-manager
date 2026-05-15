import { createError, getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { updateAd } from '../../services/adService'
import { adSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(adSchema, await readBody(event))
  const ad = await updateAd(getRouterParam(event, 'id') || '', input)
  if (!ad) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Ad not found.' })
  return ok({ ad })
})
