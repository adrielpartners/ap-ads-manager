import { ok } from '../../utils/api'
import { logout } from '../../services/authService'

export default defineEventHandler(async (event) => {
  await logout(event)
  return ok({})
})
