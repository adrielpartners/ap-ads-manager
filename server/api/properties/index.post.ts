import { readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { createProperty } from '../../services/propertyService'
import { propertySchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(propertySchema, await readBody(event))
  return ok({ property: await createProperty(input) })
})
