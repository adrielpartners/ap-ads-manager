import { ok } from '../../utils/api'
import { currentUser } from '../../services/authService'

export default defineEventHandler(async (event) => {
  return ok({ user: await currentUser(event) })
})
