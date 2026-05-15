import { describe, expect, it } from 'vitest'
import { decodeClickToken } from '../server/services/trackingService'

describe('decodeClickToken', () => {
  it('decodes valid click tokens', () => {
    const token = Buffer.from(JSON.stringify({ adId: 'ad', placementId: 'placement' })).toString('base64url')
    expect(decodeClickToken(token)).toEqual({ adId: 'ad', placementId: 'placement' })
  })

  it('rejects malformed click tokens', () => {
    expect(decodeClickToken('nope')).toBeNull()
  })
})
