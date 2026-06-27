import axios from 'axios'

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Make sure the API is running on port 8080.'
    }

    const message = error.response.data?.message

    if (typeof message === 'string') return message
    if (Array.isArray(message)) return message.join(', ')
  }

  return fallback
}
