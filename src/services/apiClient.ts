import { API_BASE_URL, SESSION_EXPIRED_MESSAGE } from '../config/api'

let activeToken: string | null = null
let onUnauthorized: (() => void) | null = null

export function setActiveToken(token: string | null): void {
  activeToken = token
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  body?: unknown
  form?: boolean
  auth?: boolean
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  let body: BodyInit | undefined

  if (options.body !== undefined) {
    if (options.form) {
      body = new URLSearchParams(options.body as Record<string, string>)
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      body = JSON.stringify(options.body)
      headers['Content-Type'] = 'application/json'
    }
  }

  if (options.auth && activeToken) {
    headers.Authorization = `Bearer ${activeToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { method, headers, body })

  if (response.status === 401 && options.auth) {
    onUnauthorized?.()
    throw new ApiError(401, SESSION_EXPIRED_MESSAGE)
  }

  if (!response.ok) {
    let detail = response.statusText
    try {
      const errorBody = await response.json()
      if (typeof errorBody.detail === 'string') detail = errorBody.detail
    } catch {
      // cuerpo no era JSON: nos quedamos con el statusText
    }
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>('GET', path, { auth }),
  post: <T>(path: string, bodyValue?: unknown, auth = false) => request<T>('POST', path, { body: bodyValue, auth }),
  postForm: <T>(path: string, bodyValue: Record<string, string>) =>
    request<T>('POST', path, { body: bodyValue, form: true }),
  patch: <T>(path: string, bodyValue?: unknown, auth = false) => request<T>('PATCH', path, { body: bodyValue, auth }),
  del: (path: string, auth = false) => request<void>('DELETE', path, { auth }),
}
