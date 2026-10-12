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
| `/login` | `Auth` | Shared login |
| `/register` | `Auth` | Member registration |

The `:id` parameter is an event slug, despite its name. For example, `/events/community-meetup` fetches the event with slug `community-meetup`.

## Member profile

`/profile` opens `MemberProfile` and requires a member session. `/cabinet` redirects to `/profile` for existing links. Visitors without a session are redirected to `/login`. Member login and registration use `POST /auth/login` and `POST /auth/register` under `VITE_API_BASE_URL`. Authentication stores one `pen_auth_session` containing the access token, refresh token, role (`ADMIN` or `MEMBER`), email, and profile. Both login pages use the same login API and session. Role is read from the auth response or JWT claims; an absent role defaults to Member. Successful login replaces the single session. Logged-in admins see Admin panel and Logout in the public header, while members see My profile and Logout. Login and registration pages redirect already logged-in users to their own area. No session IDs are generated or required. Registration without an access token redirects to login with a success message.

The profile form includes first name, last name, email, and optional `gender`, `educationDegree`, and `phoneNumber`. Saving uses `PUT /auth/profile` under `VITE_API_BASE_URL` (which already includes `/api/v1`), authenticated with the member bearer token. Successful saves update the cached member profile and support empty response bodies. Opening `/profile` loads the current member’s details using `GET /auth/profile` under the same API base URL and member bearer token. The form expects a flat profile response, shows a loading state, and offers retry on failure. The update payload sends all six fields as strings; empty strings represent cleared optional fields. Dropdown labels remain provisional until backend enum values are supplied.

## Event registration

Upcoming event cards and detail pages include member registration via `POST /events/{slug}/register` under `VITE_API_BASE_URL`, using the shared session bearer token and no request body. Registration buttons and the detail-page registration panel are visible only to logged-in members, and update when the member logs in or out. Guests cannot submit registrations. Registration state comes from the boolean `registered` property returned by authenticated `GET /events/{slug}`. The button fetches this value on load and after registration changes, showing Register when false and Unregister when true. No registration state is read from or written to localStorage. Unregister uses `DELETE /events/{slug}/register`. Failed requests preserve the last confirmed state; status-loading failures offer retry. Concurrent registration requests for the same session and event are combined. Explicit already-registered responses are followed by a status fetch. Only published upcoming events show registration controls.


## Admin routes

| URL | Component | Access | Purpose |
| --- | --- | --- | --- |
| `/admin` | `AdminPanel` | Authenticated | Admin dashboard |
| `/admin/events` | `AdminEvents` | Authenticated | Manage events |
| `/admin/users` | `AdminUsers` | Admin session required | View the users list |
| `/admin/events/new` | `AdminCreateEvent` | Authenticated | Create an event |
| `/admin/events/:slug` | `AdminEventEdit` | Authenticated | Edit an event by slug |
| `/admin/events/:slug/participants` | `AdminEventParticipants` | Admin session required | View participant details and registration history |

The admin events list (`/admin/events`) shows a **View participants** link on each event row. The participants page links back to the admin events list, uses the existing protected admin route, and calls `GET /events/{slug}/participants` using the shared authenticated API client and a role-gated admin route. It expects a list of participant records, displays all supplied fields, and includes registered/unregistered totals, loading, empty, retry, and forbidden states. The API must enforce the admin role; frontend routing follows the shared session’s Admin role.

For example, `/admin/events/community-meetup` edits the event with slug `community-meetup`. The static `/admin/events/new` route opens the creation page.

Protected admin routes use [ProtectedRoute](src/components/admin/ProtectedRoute.jsx). Unauthenticated visitors are redirected to `/login`, with the requested location stored in navigation state as `from`.

## Layout and unmatched URLs

Shared logout calls `POST /auth/logout` under `VITE_API_BASE_URL` (which includes `/api/v1`) with the stored bearer token and no body. Local credentials are cleared immediately, even if the logout API fails. Authenticated clients handle expired access tokens on HTTP 401 or 403 using `POST /auth/refresh-token` with `{ refreshToken }`, preserve rotated refresh tokens, and retry the original request once. Concurrent failures share one refresh per current access token; delayed failures reuse the refreshed token. JWTs within 30 seconds of expiry refresh before API requests. Network/server refresh failures preserve the session so another request can retry. A missing refresh token, refresh rejection with 401/403, or a retried API request returning 401 clears the session and redirects to `/login` for both roles. A retried 403 preserves the refreshed session and surfaces the permission error. The first 403 attempts refresh rather than immediately logging out. Anonymous failures and responses from an older login do not log out the current user. In-flight refreshes cannot restore a logged-out session or replay under a different login.

The Users link in the admin dashboard and event pages opens `/admin/users`. The page calls `GET /users` through the admin API client, expects an array of user profiles, and shows first name, last name, email, gender, phone number, and education degree. It includes user totals, refresh, loading, empty, retry, and forbidden states. Access uses the existing protected admin route and Admin role; the backend enforces the admin role.

[App.jsx](src/App.jsx) provides `BrowserRouter` and the shared layout. URLs beginning with `/admin` hide the public navbar and footer.

No catch-all or 404 route is currently defined. Unmatched URLs render no route content inside the shared layout.

Both admins and members sign in at `/login` using `POST /auth/login`. The role returned by the backend (or carried in the access token) selects `/admin` for admins and `/profile` for members. Members returning from an event detail page return to that event.

The admin events list loads all statuses using authenticated `GET /events/admin/all` and displays Draft, Published, Cancelled, and Completed badges. Public upcoming/past endpoints remain in use on public pages.

The admin list sends zero-based `page` and `size` query parameters (10, 25, or 50 events per page). Optional `category` and `status` filters are combined and omitted when set to All. The API returns a Spring Page with `content`, `totalElements`, and `totalPages`. Changing a filter or page size returns to the first page; pagination and result counts use the server totals.

## Event feedback

Logged-in members whose event response has `registered: true` can leave feedback on the event detail page for `COMPLETED` events or `PUBLISHED` events with a date before today. Draft, cancelled, current-day, and future published events do not show the form. Submission uses authenticated `POST /events/{slug}/feedback` with an integer `rating` from 1 to 5 and an optional `comment` of at most 2000 characters. Success keeps the form available and changes its button to Update feedback; subsequent submissions use the same POST endpoint to update the existing entry. Failed submissions retain entered feedback for retry. The backend must enforce registration eligibility and one feedback entry per user/event by updating that entry on repeated POST requests.

The bottom of each public event detail page lists participant feedback using `GET /events/{slug}/feedback`. The frontend currently expects an array of entries with `rating` and optional `comment` fields. It renders star ratings and comments, includes loading/empty/error states and retry, and reloads after successful feedback creation or updates.

Feedback entries include event/user IDs, event slug, participant names and email, rating, comment, and created/updated timestamps. The list shows participant names and wall-clock timestamps without exposing emails or IDs. The current member’s entry prefills the update form, matched by user ID or email.
