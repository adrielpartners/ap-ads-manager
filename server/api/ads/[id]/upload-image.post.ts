import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { createError, getRouterParam, readMultipartFormData } from 'h3'
import { ok } from '../../../utils/api'
import { requireOwner } from '../../../services/authService'
import { generatedImageName } from '../../../services/uploadService'
import { setAdImage } from '../../../services/adService'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const parts = await readMultipartFormData(event)
  const file = parts?.find((part) => part.name === 'image' && part.filename)
  if (!file?.filename || !file.type || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'UPLOAD_REJECTED', message: 'Upload an image file.' })
  }

  const filename = generatedImageName(file.filename, file.type)
  const config = useRuntimeConfig()
  await mkdir(config.uploadDir, { recursive: true })
  const imagePath = join(config.uploadDir, filename)
  await new Promise<void>((resolve, reject) => {
    const stream = createWriteStream(imagePath)
    stream.on('error', reject)
    stream.on('finish', resolve)
    stream.end(file.data)
  })

  const imageUrl = `${config.publicImageBaseUrl.replace(/\/$/, '')}/${filename}`
  return ok({ ad: await setAdImage(getRouterParam(event, 'id') || '', imagePath, imageUrl) })
})
