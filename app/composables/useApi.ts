export async function useApiFetch<T>(url: string, options: any = {}) {
  const response = await $fetch<any>(url, options)
  if (!response.ok) throw new Error(response.error?.message || 'Request failed')
  return response.data as T
}
