import { mount, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import AdminUsers from '../../src/pages/admin/AdminUsers'
import { fetchUsers } from '../../src/services/usersService'

describe('AdminUsers', () => {
  it('AdminUsers displays server users', async () => {
    fetchUsers.mockResolvedValue([{ id: 1, firstName: 'Jane', lastName: 'Doe', email: member.email }])
    mount(<AdminUsers />)
    expect(await screen.findByText(member.email)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Users table' })).toBeInTheDocument()
  })
})
