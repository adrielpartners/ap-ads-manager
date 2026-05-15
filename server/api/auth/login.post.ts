import { readBody } from 'h3'
import { ok, parseBody } from '../../utils/api'
import { login } from '../../services/authService'
import { loginSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const input = parseBody(loginSchema, await readBody(event))
  const user = await login(event, input.email, input.password)
  return ok({ user })
})
