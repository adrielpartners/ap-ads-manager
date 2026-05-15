import { setResponseStatus } from 'h3'
import type { ApiErrorCode } from './api'

export function success<T>(data: T) {
  return { ok: true, data }
}

export function errorResponse(event: any, code: ApiErrorCode, message: string, statusCode = 400) {
  setResponseStatus(event, statusCode)
  return { ok: false, error: { code, message } }
}
