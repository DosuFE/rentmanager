const PRODUCTION_API_URL = 'https://rentmanager-frgw.onrender.com'

export function getApiBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    PRODUCTION_API_URL

  const normalized = raw.replace(/\/+$/, '')

  const isLocalhost =
    normalized.includes('localhost') || normalized.includes('127.0.0.1')

  if (process.env.NODE_ENV === 'production' && isLocalhost) {
    return PRODUCTION_API_URL
  }

  return normalized
}
