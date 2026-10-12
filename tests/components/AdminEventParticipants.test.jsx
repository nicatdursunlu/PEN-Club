import { mount, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import AdminEventParticipants from '../../src/pages/admin/AdminEventParticipants'
import * as api from '../../src/services/eventsService'

describe('AdminEventParticipants', () => {
  it('AdminEventParticipants displays API records and requests the route slug', async () => {
    api.fetchEventParticipants.mockResolvedValue([{ id: 1, firstName: 'Jane', lastName: 'Doe', email: member.email, registered: true }])
    mount(<AdminEventParticipants />, '/admin/events/party/participants', '/admin/events/:slug/participants')
    expect(await screen.findByText(member.email)).toBeInTheDocument()
    expect(api.fetchEventParticipants).toHaveBeenCalledWith('party')
  })
})
