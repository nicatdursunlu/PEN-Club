import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

vi.mock('../../src/services/authService', () => ({ getSession: vi.fn(), isAdmin: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn() }))
vi.mock('../../src/services/eventsService', () => ({ fetchAllEvents: vi.fn(), fetchDashboard: vi.fn(), fetchUpcomingEvents: vi.fn(), fetchPastEvents: vi.fn(), fetchEventBySlug: vi.fn(), fetchEventParticipants: vi.fn(), createEvent: vi.fn(), updateEvent: vi.fn(), publishEvent: vi.fn(), cancelEvent: vi.fn(), cloneEvent: vi.fn() }))
vi.mock('../../src/services/eventRegistrationService', () => ({ registerForEvent: vi.fn(), unregisterFromEvent: vi.fn() }))
vi.mock('../../src/services/memberProfileService', () => ({ getMemberProfile: vi.fn(), updateMemberProfile: vi.fn() }))
vi.mock('../../src/services/usersService', () => ({ fetchUsers: vi.fn() }))
