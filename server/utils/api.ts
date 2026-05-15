import { createError, getHeader } from 'h3'
import { ZodError, type ZodSchema } from 'zod'

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'UNSAFE_URL'
  | 'UPLOAD_REJECTED'
  | 'INTERNAL_ERROR'

export function ok<T>(data: T) {
  return { ok: true, data }
}

export function parseBody<T>(schema: ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'VALIDATION_ERROR', message: 'Please check the submitted fields.' })
    }
    throw error
  }
}

export function normalizeDomain(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
}

export function getClientIp(event: any) {
  return getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || event.node.req.socket.remoteAddress || ''
}
