import { createError, getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { updateProperty } from '../../services/propertyService'
import { propertySchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(propertySchema, await readBody(event))
  const property = await updateProperty(getRouterParam(event, 'id') || '', input)
  if (!property) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Property not found.' })
  return ok({ property })
})
