import axios from 'axios'
import { getApiBaseUrl } from '@/lib/api-config'

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      const apiUrl = getApiBaseUrl()
      return `Cannot reach the server at ${apiUrl}. Check that the API is online and CORS is configured for this site.`
    }

    const message = error.response.data?.message

    if (typeof message === 'string') return message
    if (Array.isArray(message)) return message.join(', ')
  }

  return fallback
}
