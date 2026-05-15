import { createError, getRouterParam } from 'h3'
import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { getAdvertiser } from '../../services/advertiserService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const advertiser = await getAdvertiser(getRouterParam(event, 'id') || '')
  if (!advertiser) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Advertiser not found.' })
  return ok({ advertiser })
})
