import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'

const allowedMime: Record<string, string[]> = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
  '.gif': ['image/gif']
}

export function validateUpload(filename: string, mimeType: string) {
  const extension = extname(filename).toLowerCase()
  const allowed = allowedMime[extension]
  if (!allowed || !allowed.includes(mimeType)) {
    throw new Error('UPLOAD_REJECTED')
  }
  return extension
}

export function generatedImageName(originalName: string, mimeType: string) {
  const extension = validateUpload(originalName, mimeType)
  return `${randomUUID()}${extension}`
}
