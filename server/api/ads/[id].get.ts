import { createError, getRouterParam } from 'h3'
import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { getAd } from '../../services/adService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const ad = await getAd(getRouterParam(event, 'id') || '')
  if (!ad) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Ad not found.' })
  return ok({ ad })
})
