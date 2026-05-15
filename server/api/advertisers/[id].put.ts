import { createError, getRouterParam, readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { updateAdvertiser } from '../../services/advertiserService'
import { advertiserSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(advertiserSchema, await readBody(event))
  const advertiser = await updateAdvertiser(getRouterParam(event, 'id') || '', input)
  if (!advertiser) throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND', message: 'Advertiser not found.' })
  return ok({ advertiser })
})
