import { getHeader, readBody } from 'h3'
import { ok, getClientIp, parseBody } from '../../utils/api'
import { recordEvent } from '../../services/trackingService'
import { impressionSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const input = parseBody(impressionSchema, await readBody(event))
  await recordEvent({
    ...input,
    event_type: 'impression',
    referrer: getHeader(event, 'referer'),
    user_agent: getHeader(event, 'user-agent'),
    ip: getClientIp(event)
  })
  return ok({ tracked: true })
})
