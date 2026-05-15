import { getQuery } from 'h3'
import { ok } from '../../utils/api'
import { requireOwner } from '../../services/authService'
import { overviewReport } from '../../services/reportService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const query = getQuery(event)
  return ok({ report: await overviewReport({ start: query.start as string, end: query.end as string }) })
})
