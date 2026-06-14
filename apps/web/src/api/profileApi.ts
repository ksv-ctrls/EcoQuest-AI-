import { apiClient } from '@/api/apiClient'
import type { UserProfile, ProfileInput } from '@/types/user'

export async function getProfile() {
  const response = await apiClient.get<{ user: { profile: UserProfile } }>('/auth/me')
  return response.data.user.profile
}

export async function updateProfile(payload: ProfileInput) {
  const response = await apiClient.put<{ user: { profile: UserProfile } }>('/auth/profile', payload)
  return response.data.user.profile
}
