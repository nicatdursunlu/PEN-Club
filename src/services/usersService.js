import axiosInstance from './axiosInstance'
import { isAdmin } from './authService'

export const fetchUsers = async () => {
  if (!isAdmin()) throw new Error('Admin login is required to view users.')
  const { data } = await axiosInstance.get('/users')
  if (!Array.isArray(data)) throw new Error('The users response is not a list.')
  return data
}
