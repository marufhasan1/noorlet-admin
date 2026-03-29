function readXsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function applyHeaders(options: { headers?: HeadersInit }, extra: Record<string, string>) {
  if (!options.headers) {
    options.headers = extra
    return
  }
  if (options.headers instanceof Headers) {
    for (const [k, v] of Object.entries(extra)) options.headers.set(k, v)
    return
  }
  const existing: Record<string, string> = {}
  if (Array.isArray(options.headers)) {
    for (const [k, v] of options.headers as [string, string][]) existing[k] = v
  } else {
    Object.assign(existing, options.headers)
  }
  options.headers = { ...existing, ...extra }
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const appBase = apiBase.replace(/\/api\/?$/, '')

  async function refreshCsrf() {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: appBase,
      credentials: 'include',
    }).catch(() => {})
  }

  await refreshCsrf()

  const apiFetch = $fetch.create({
    baseURL: apiBase,
    credentials: 'include',
    async onRequest({ options }) {
      const method = ((options.method as string) ?? 'GET').toUpperCase()

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !readXsrfToken()) {
        await refreshCsrf()
      }

      const extra: Record<string, string> = { Accept: 'application/json' }
      const xsrf = readXsrfToken()
      if (xsrf) extra['X-XSRF-TOKEN'] = xsrf

      applyHeaders(options, extra)
    },
  })

  return {
    provide: { apiFetch },
  }
})
