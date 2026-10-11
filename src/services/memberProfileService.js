import axiosInstance from './axiosInstance'
import { getSession, updateSessionProfile } from './authService'

const request = async (config) => {
  const session = getSession('MEMBER')
  if (!session) throw new Error('Please log in to continue.')
  return axiosInstance({ ...config, _expectedAccessToken: session.accessToken })
}

export const getMemberProfile = async () => {
  const { data } = await request({ method: 'GET', url: '/auth/profile' })
  return data
}

export const updateMemberProfile = async (profile) => {
  const response = await request({
    method: 'PUT',
    url: '/auth/profile',
    data: profile,
  })
  // Also supports successful updates with an empty (204) response body.
  updateSessionProfile(profile, response.config._authToken)
  return profile
}
