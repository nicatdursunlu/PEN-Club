import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Events from '../pages/Events'
import EventDetail from '../pages/EventDetail'
import Gallery from '../pages/Gallery'
import Contact from '../pages/Contact'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminPanel from '../pages/admin/AdminPanel'
import AdminCreateEvent from '../pages/admin/AdminCreateEvent'
import AdminEvents from '../pages/admin/AdminEvents'
import AdminEventEdit from '../pages/admin/AdminEventEdit'
import AdminEventParticipants from '../pages/admin/AdminEventParticipants'
import AdminUsers from '../pages/admin/AdminUsers'
import ProtectedRoute from '../components/admin/ProtectedRoute'
import MemberAuth from '../pages/member/MemberAuth'
import MemberProfile from '../pages/member/MemberProfile'
import MemberRoute from './member/MemberRoute'

function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<MemberAuth key="login" />} />
      <Route path="/register" element={<MemberAuth key="register" register />} />
      <Route path="/profile" element={<MemberRoute><MemberProfile /></MemberRoute>} />
      <Route path="/cabinet" element={<Navigate to="/profile" replace />} />

      {/* Admin Routes */}
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/events/:slug/participants" element={<ProtectedRoute><AdminEventParticipants /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute>
            <AdminEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events/new"
        element={
          <ProtectedRoute>
            <AdminCreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events/:slug"
        element={
          <ProtectedRoute>
            <AdminEventEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default Router
