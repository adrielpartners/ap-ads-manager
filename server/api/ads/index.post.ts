import { readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { createAd } from '../../services/adService'
import { adSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseBody(adSchema, await readBody(event))
  return ok({ ad: await createAd(input) })
})
