export async function apiFetch<T>(
  service: 'gamma' | 'clob' | 'data' | 'kalshi',
  path: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  const suffix = `${path}${qs ? `?${qs}` : ''}`
  const prefix = `/api/${service}`

  const envProxy = import.meta.env.VITE_API_PROXY as string | undefined
  const url = envProxy
    ? `${envProxy.replace(/\/$/, '')}${prefix}${suffix}`
    : `${prefix}${suffix}`

  const res = await fetch(url)
  const text = await res.text()
  let data: T | { error?: string }
  try {
    data = JSON.parse(text) as T | { error?: string }
  } catch {
    throw new Error(`Invalid JSON from ${service} (${res.status})`)
  }

  if (!res.ok) {
    throw new Error(
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: string }).error)
        : `${service} API error ${res.status}`,
    )
  }

  if (data && typeof data === 'object' && 'error' in data && !Array.isArray(data)) {
    throw new Error(String((data as { error: string }).error))
  }

  return data as T
}
