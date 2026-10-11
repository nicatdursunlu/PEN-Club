// Compatibility helpers use the single role-based authentication session.
import { getSession, login, register } from './authService'
export { AUTH_CHANGE_EVENT as MEMBER_AUTH_EVENT } from './authStorage'
export { logout as logoutMember, clearTokens as clearMemberSession, refreshAccessToken as refreshMemberAccessToken, updateSessionProfile as updateMemberSessionProfile } from './authService'
export const getMemberSession = () => getSession()?.role === 'MEMBER' ? getSession() : null
export const loginMember = ({ email, password }) => login(email, password)
export const registerMember = register
