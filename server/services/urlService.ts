import { isSafeHttpUrl } from '../utils/security'

export type UtmValues = {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
}

const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export function buildDestinationUrl(destinationUrl: string, propertyUtm: UtmValues, adUtm: UtmValues) {
  if (!isSafeHttpUrl(destinationUrl)) {
    throw new Error('UNSAFE_URL')
  }

  const url = new URL(destinationUrl)
  for (const key of utmKeys) {
    const value = clean(adUtm[key]) || clean(propertyUtm[key])
    if (value) url.searchParams.set(key, value)
  }
  return url.toString()
}

export function clean(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
