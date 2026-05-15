import { createError, getRouterParam } from 'h3'
import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { getProperty } from '../../services/propertyService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const property = await getProperty(getRouterParam(event, 'id') || '')
  if (!property) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Property not found.' })
  return ok({ property })
})
