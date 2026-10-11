# Route reference

All page routes are defined in [src/components/Router.jsx](src/components/Router.jsx). These are browser URLs, not API endpoints.

## Public routes

| URL | Component | Purpose |
| --- | --- | --- |
| `/` | `Home` | Home page |
| `/about` | `About` | Information about PEN Club |
| `/events` | `Events` | Event listing |
| `/events/:id` | `EventDetail` | Details for an event |
| `/gallery` | `Gallery` | Gallery page |
| `/contact` | `Contact` | Contact page |
| `/login` | `MemberAuth` | Member login |
| `/register` | `MemberAuth` | Member registration |

The `:id` parameter is an event slug, despite its name. For example, `/events/community-meetup` fetches the event with slug `community-meetup`.

## Member profile

`/profile` opens `MemberProfile` and requires a member session. `/cabinet` redirects to `/profile` for existing links. Visitors without a session are redirected to `/login`. Member login and registration use `POST /auth/login` and `POST /auth/register` under `VITE_API_BASE_URL`. Authentication stores one `pen_auth_session` containing the access token, refresh token, role (`ADMIN` or `MEMBER`), email, and profile. Both login pages use the same login API and session. Role is read from the auth response or JWT claims; an absent role defaults to Member. Successful login replaces the single session. Logged-in admins see Admin panel and Logout in the public header, while members see My profile and Logout. Login and registration pages redirect already logged-in users to their own area. No session IDs are generated or required. Registration without an access token redirects to login with a success message.

The profile form includes first name, last name, email, and optional `gender`, `educationDegree`, and `phoneNumber`. Saving uses `PUT /auth/profile` under `VITE_API_BASE_URL` (which already includes `/api/v1`), authenticated with the member bearer token. Successful saves update the cached member profile and support empty response bodies. Opening `/profile` loads the current member’s details using `GET /auth/profile` under the same API base URL and member bearer token. The form expects a flat profile response, shows a loading state, and offers retry on failure. The update payload sends all six fields as strings; empty strings represent cleared optional fields. Dropdown labels remain provisional until backend enum values are supplied.

## Event registration

Upcoming event cards and detail pages include member registration via `POST /events/{slug}/register` under `VITE_API_BASE_URL`, using the shared session bearer token and no request body. Registration buttons and the detail-page registration panel are visible only to logged-in members, and update when the member logs in or out. Guests cannot submit registrations. Successful registration is remembered per member in this browser, shows “You’re registered,” and offers an Unregister button instead of another registration. Unregister uses `DELETE /event/{slug}/register` (singular `event`, as supplied), with the member bearer token. A successful cancellation clears the saved registration and restores Register; a failed cancellation preserves the registered state and allows retry. Concurrent requests for the same member and event are combined. Explicit “already registered” responses (400, 409, or 422) also show the registered state; other failures allow retry. The backend must enforce one registration per member across devices. No registration-status read endpoint or response field has been supplied, so another browser learns of an existing registration when the API reports it.

## Admin routes

| URL | Component | Access | Purpose |
| --- | --- | --- | --- |
| `/admin/login` | `AdminLogin` | Public | Admin sign-in |
| `/admin` | `AdminPanel` | Authenticated | Admin dashboard |
| `/admin/events` | `AdminEvents` | Authenticated | Manage events |
| `/admin/users` | `AdminUsers` | Admin session required | View the users list |
| `/admin/events/new` | `AdminCreateEvent` | Authenticated | Create an event |
| `/admin/events/:slug` | `AdminEventEdit` | Authenticated | Edit an event by slug |
| `/admin/events/:slug/participants` | `AdminEventParticipants` | Admin session required | View participant details and registration history |

The admin events list (`/admin/events`) shows a **View participants** link on each upcoming and past event row. The participants page links back to the admin events list, uses the existing protected admin route, and calls `GET /events/{slug}/participants` using the shared authenticated API client and a role-gated admin route. It expects a list of participant records, displays all supplied fields, and includes registered/unregistered totals, loading, empty, retry, and forbidden states. The API must enforce the admin role; frontend routing follows the shared session’s Admin role.

For example, `/admin/events/community-meetup` edits the event with slug `community-meetup`. The static `/admin/events/new` route opens the creation page.

Protected admin routes use [ProtectedRoute](src/components/admin/ProtectedRoute.jsx). Unauthenticated visitors are redirected to `/admin/login`, with the requested location stored in navigation state as `from`.

## Layout and unmatched URLs

Shared logout calls `POST /auth/logout` under `VITE_API_BASE_URL` (which includes `/api/v1`) with the stored bearer token and no body. Local credentials are cleared immediately, even if the logout API fails. Authenticated clients handle expired access tokens on HTTP 401 or 403 using `POST /auth/refresh-token` with `{ refreshToken }`, preserve rotated refresh tokens, and retry the original request once. Concurrent failures share one refresh per current access token; delayed failures reuse the refreshed token. Logout occurs only when refresh fails or the retried request returns another 401/403, redirecting to `/admin/login` for Admin or `/login` for Member. The first 403 attempts refresh rather than immediately logging out. Anonymous failures and responses from an older login do not log out the current user. In-flight refreshes cannot restore a logged-out session or replay under a different login.

The Users link in the admin dashboard and event pages opens `/admin/users`. The page calls `GET /users` through the admin API client, expects an array of user profiles, and shows first name, last name, email, gender, phone number, and education degree. It includes user totals, refresh, loading, empty, retry, and forbidden states. Access uses the existing protected admin route and Admin role; the backend enforces the admin role.

[App.jsx](src/App.jsx) provides `BrowserRouter` and the shared layout. URLs beginning with `/admin` hide the public navbar and footer.

No catch-all or 404 route is currently defined. Unmatched URLs render no route content inside the shared layout.
