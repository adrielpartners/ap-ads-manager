export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return
  const response = await $fetch<any>('/api/auth/me').catch(() => null)
  if (!response?.data?.user) return navigateTo('/login')
})
