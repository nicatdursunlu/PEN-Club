import React from 'react'
import { beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import * as auth from '../../src/services/authService'
import * as api from '../../src/services/eventsService'
import * as profile from '../../src/services/memberProfileService'
import { fetchUsers } from '../../src/services/usersService'

export const member = { accessToken: 'token', email: 'jane@example.com', role: 'MEMBER', profile: {} }
export const event = { id: 1, slug: 'party', title: 'New Year Party', description: 'Celebrate together', date: '2099-12-31', time: '6:00 PM - 8:00 PM', status: 'PUBLISHED', category: 'ENJOY', registered: false }
export const page = (content = [event], totalElements = content.length, totalPages = 1) => ({ content, totalElements, totalPages })
function Location() { const location = useLocation(); return <output data-testid="location">{location.pathname}</output> }
export function mount(component, path = '/', route) {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{route === 'router' ? component : <Routes><Route path={route || path} element={component} /><Route path="*" element={null} /></Routes>}<Location /></MemoryRouter>)
}
export function setSession(session) {
  auth.getSession.mockImplementation((role) => !role || session?.role === role ? session : null)
  auth.isAdmin.mockReturnValue(session?.role === 'ADMIN')
}
beforeEach(() => {
  vi.resetAllMocks()
  setSession(null)
  api.fetchAllEvents.mockResolvedValue(page())
  api.fetchUpcomingEvents.mockResolvedValue([event])
  api.fetchPastEvents.mockResolvedValue([])
  api.fetchEventBySlug.mockResolvedValue(event)
  api.fetchDashboard.mockResolvedValue({ totalEvents: 5 })
  api.fetchEventParticipants.mockResolvedValue([])
  fetchUsers.mockResolvedValue([])
  profile.getMemberProfile.mockResolvedValue({ firstName: 'Jane', lastName: 'Doe', email: member.email })
})

