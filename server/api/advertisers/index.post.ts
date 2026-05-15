import { readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { createAdvertiser } from '../../services/advertiserService'
import { advertiserSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(advertiserSchema, await readBody(event))
  return ok({ advertiser: await createAdvertiser(input) })
})
