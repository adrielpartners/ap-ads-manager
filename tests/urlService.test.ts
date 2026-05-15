import { describe, expect, it } from 'vitest'
import { buildDestinationUrl } from '../server/services/urlService'

describe('buildDestinationUrl', () => {
  it('merges property defaults and ad overrides', () => {
    const result = buildDestinationUrl(
      'https://example.com/path?utm_source=old',
      { utm_source: 'property', utm_medium: 'display', utm_campaign: 'launch' },
      { utm_source: '', utm_content: 'homepage-top' }
    )
    const url = new URL(result)
    expect(url.searchParams.get('utm_source')).toBe('property')
    expect(url.searchParams.get('utm_medium')).toBe('display')
    expect(url.searchParams.get('utm_campaign')).toBe('launch')
    expect(url.searchParams.get('utm_content')).toBe('homepage-top')
  })

  it('rejects unsafe schemes', () => {
    expect(() => buildDestinationUrl('javascript:alert(1)', {}, {})).toThrow('UNSAFE_URL')
  })
})
