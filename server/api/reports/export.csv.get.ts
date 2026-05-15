import { getQuery, setHeader } from 'h3'
import { requireOwner } from '../../services/authService'
import { exportCsv } from '../../services/reportService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const query = getQuery(event)
  setHeader(event, 'content-type', 'text/csv; charset=utf-8')
  setHeader(event, 'content-disposition', 'attachment; filename="ap-ads-report.csv"')
  return exportCsv({ start: query.start as string, end: query.end as string })
})
