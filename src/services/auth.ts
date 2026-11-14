import { api } from './apiClient'
import type { Token, UserRead } from '../types/api'

export async function login(username: string, password: string): Promise<Token> {
  return api.postForm<Token>('/api/v1/auth/login', { username, password })
}

export async function me(): Promise<UserRead> {
  return api.get<UserRead>('/api/v1/auth/me', true)
}
