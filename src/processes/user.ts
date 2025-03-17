import api from '@/app/api'

export interface User {
  id: string
  email: string
  name: string
  phone_number: string
  isAdmin: boolean
  permissions: object[]
  team: {
    plan_status: string
    name: string
  }
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  phone_number?: string
  oldPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

export const getUserInfo = async (): Promise<User | null> => {
  try {
      const { data } = await api.get<User>('/user/info');

      return data
    } catch {
      return null
  }
}

export const updateUser = async (userId: string, payload: UpdateUserPayload): Promise<User> => {
  const { data } = await api.put<User>(`/user/${userId}`, payload);

  return data;
}
