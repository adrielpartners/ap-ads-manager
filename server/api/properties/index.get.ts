import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { listProperties } from '../../services/propertyService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  return ok({ properties: await listProperties() })
})
