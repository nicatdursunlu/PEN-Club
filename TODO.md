# Admin Panel - TODO

## Plan
Create Admin Panel with JWT authentication and event creation form.

## Steps

- [x] Understand project structure and existing files
- [x] Create `src/services/authService.js` - login, refresh, logout, token helpers
- [x] Edit `src/services/axiosInstance.js` - add request/response interceptors for JWT
- [x] Edit `src/services/eventsService.js` - add `createEvent()` POST /events, `updateEvent()` PUT /events/:slug
- [x] Create `src/components/admin/ProtectedRoute.jsx` - auth guard component
- [x] Create `src/components/admin/EventForm.jsx` - shared form component (create + edit)
- [x] Create `src/pages/admin/AdminLogin.jsx` - login form with JWT auth
- [x] Create `src/pages/admin/AdminPanel.jsx` - dashboard with stats cards + quick actions at /admin
- [x] Create `src/pages/admin/AdminCreateEvent.jsx` - create event form at /admin/events/new
- [x] Create `src/pages/admin/AdminEvents.jsx` - list all events at /admin/events
- [x] Create `src/pages/admin/AdminEventEdit.jsx` - edit event form at /admin/events/:slug
- [x] Edit `src/App.jsx` - all admin routes registered, Navbar/Footer hidden on admin pages
