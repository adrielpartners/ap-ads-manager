import { describe, expect, it } from 'vitest'
import { validateUpload } from '../server/services/uploadService'

describe('validateUpload', () => {
  it('accepts known raster image types', () => {
    expect(validateUpload('creative.webp', 'image/webp')).toBe('.webp')
  })

  it('rejects svg and mismatched mime types', () => {
    expect(() => validateUpload('creative.svg', 'image/svg+xml')).toThrow('UPLOAD_REJECTED')
    expect(() => validateUpload('creative.png', 'application/octet-stream')).toThrow('UPLOAD_REJECTED')
  })
})
