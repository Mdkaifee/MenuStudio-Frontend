const DEFAULT_API_BASE_URL = 'https://menustudio-backend.onrender.com'
// Local development (switch when running backend locally):
// const DEFAULT_API_BASE_URL = 'http://localhost:8000'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
export const TOKEN_KEY = 'restaurant_menu_token'
export const USER_KEY = 'restaurant_menu_user'

export function getSavedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const toText = (value) => {
      if (typeof value === 'string') {
        return value
      }
      if (value && typeof value === 'object') {
        if (typeof value.msg === 'string') {
          return value.msg
        }
        if (typeof value.reason === 'string') {
          return value.reason
        }
        if (typeof value.error === 'string') {
          return value.error
        }
        try {
          return JSON.stringify(value)
        } catch {
          return String(value)
        }
      }
      return String(value)
    }

    let errorMessage = 'Request failed'
    if (Array.isArray(data.detail)) {
      errorMessage = data.detail
        .map((entry) => {
          const fromMsg = toText(entry?.msg)
          if (fromMsg && fromMsg !== 'undefined') {
            return fromMsg
          }
          const fromCtx = toText(entry?.ctx)
          return fromCtx && fromCtx !== 'undefined' ? fromCtx : 'Validation error'
        })
        .join(', ')
    } else if (data.detail !== undefined) {
      errorMessage = toText(data.detail)
    }

    throw new Error(errorMessage)
  }

  return data
}
