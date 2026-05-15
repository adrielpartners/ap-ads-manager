import { send, setHeader, setResponseStatus } from 'h3'

export default function errorHandler(error: any, event: any) {
  const statusCode = Number(error?.statusCode || 500)
  const code = statusCode >= 500 ? 'INTERNAL_ERROR' : String(error?.statusMessage || 'ERROR')
  const message = statusCode >= 500 ? 'Something went wrong.' : String(error?.message || 'Request failed.')

  setResponseStatus(event, statusCode)
  setHeader(event, 'content-type', 'application/json; charset=utf-8')
  return send(event, JSON.stringify({
    ok: false,
    error: { code, message }
  }))
}
