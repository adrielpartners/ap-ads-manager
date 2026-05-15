import { createHash, randomBytes } from 'node:crypto'

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export function hashIp(ip: string) {
  const config = useRuntimeConfig()
  const secret = config.ipHashSecret || 'development-ip-secret'
  return createHash('sha256').update(`${secret}:${ip}`).digest('hex')
}

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
