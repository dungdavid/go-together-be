# Go Together — Backend

NestJS + PostgreSQL (Neon) + Prisma API for a personal travel-journal app: save places you've visited, keep a per-place checklist, log the food you ate, and attach photos — all on a Leaflet-ready map. Single user, no account scoping on data yet (see [Authentication](#authentication)).

## Tech stack

- [NestJS](https://nestjs.com/) 11 (CommonJS — intentionally pinned, see [Notes on versions](#notes-on-versions))
- TypeScript 5, `strict: true`
- [Prisma](https://www.prisma.io/) 6 + PostgreSQL ([Neon](https://neon.tech/))
- `class-validator` / `class-transformer` for request validation
- `@nestjs/jwt` + `bcryptjs` for authentication
- Jest for unit tests
- Deploys to [Vercel](https://vercel.com/) as a Node serverless function

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma db push     # creates/syncs tables on your Postgres database
npm run start:dev      # http://localhost:3000
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon pooled connection recommended). |
| `PORT` | Local dev server port (defaults to `3000`). |
| `JWT_SECRET` | Signing secret for login tokens. Use a long random string. |

### Seeding data

```bash
npm run db:seed            # 6 curated demo places (matches the frontend's mock data)
npm run db:seed:test-data  # 1 login-ready test account + 50 generated places for load/pagination testing
```

Both scripts are idempotent — safe to re-run.

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start with hot reload. |
| `npm run start` | Start without watch mode. |
| `npm run build` | Compile to `dist/` (`nest build`). |
| `npm test` | Run the Jest unit test suite. |
| `npm run db:seed` | Seed the 6 curated demo places. |
| `npm run db:seed:test-data` | Seed a test account + 50 bulk test places. |

## API overview

All endpoints are unauthenticated except `GET /auth/me`. CORS is open and there is no rate limiting — both deliberate for this phase.

### Auth

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/auth/register` | `{ username, displayName, password }` | Returns `{ accessToken, user }`. |
| POST | `/auth/login` | `{ username, password }` | Returns `{ accessToken, user }`. |
| GET | `/auth/me` | — | Requires `Authorization: Bearer <accessToken>`. |
| GET | `/auth/check-username?username=` | — | `{ available: boolean }`. |

### Places

| Method | Path | Notes |
|---|---|---|
| GET | `/places` | Each place includes nested `checklist`, `foodList`, `photos`. |
| GET | `/places/:id` | Same nested shape as above. |
| POST | `/places` | `{ name, lat, lng, region?, visitedAt?, coverPhotoUrl?, notes?, perspective? }` |
| PATCH | `/places/:id` | Partial update of the same fields. |
| DELETE | `/places/:id` | Cascades to the place's checklist items, food items, and photos. |

### Checklist items, food items, photos

Each is scoped to a place for creation/listing, and addressed directly by id for updates/deletes:

| Resource | Create / List | Update / Delete |
|---|---|---|
| Checklist item | `POST`/`GET /places/:placeId/checklist-items` | `PATCH`/`DELETE /checklist-items/:id` |
| Food item | `POST`/`GET /places/:placeId/food-items` | `PATCH`/`DELETE /food-items/:id` |
| Photo | `POST`/`GET /places/:placeId/photos` | `PATCH`/`DELETE /photos/:id` |

#### Photo uploads

The backend never handles binary image uploads — `Photo.url` is a plain string. The frontend uploads the file directly to [Cloudinary](https://cloudinary.com) (via an **unsigned** upload preset) and sends the resulting `secure_url` as the `url` field to `POST /places/:placeId/photos`. This avoids Vercel serverless function body-size/duration limits and keeps the backend's responsibility to "store a URL."

### Request logging

Every request is logged to the `RequestLog` table (method, path, status code, duration, IP, user agent) via a global interceptor. Logging failures never fail the actual request.

## Data model

See [`prisma/schema.prisma`](prisma/schema.prisma). Field names (`lat`/`lng`, `visitedAt`, `checklist`/`foodList`/`photos`, `label`/`done`, etc.) are deliberately matched to a companion frontend app's existing types, so the API can be consumed without a mapping layer.

## Authentication

`AuthModule` provides register/login/`me` with JWT access tokens (`JwtAuthGuard` + `@CurrentUser()` decorator). Place/ChecklistItem/FoodItem/Photo data is **not** scoped to a user yet — any authenticated or unauthenticated caller can read and write all of it. Adding per-user ownership (a `userId` on `Place`, guards on the CRUD controllers) is a deliberately separate, not-yet-done piece of work.

## Deployment (Vercel)

- `api/index.ts` wraps the same `AppModule` in an Express adapter for Vercel's Node runtime; `vercel.json` routes all traffic through it.
- Set the project's **Root Directory** to this folder if deploying from a monorepo.
- Set `DATABASE_URL` and `JWT_SECRET` per environment (Production / Preview) in the Vercel dashboard — never commit real values.

## Notes on versions

- `@nestjs/*` core packages and `@nestjs/jwt` are pinned to their last CommonJS-published majors (`^11.x` / `11.0.2`). Newer majors (`@nestjs/common@12`, `@nestjs/jwt@12`) ship `"type": "module"` and are incompatible with this project's CommonJS Jest setup and Express-wrapped Vercel entrypoint.
- Prisma is pinned to `6.x` stable.

## Testing

```bash
npm test
```

Unit tests cover every service method (mocked `PrismaService`), the request-logging interceptor (including the fire-and-forget failure path), and the JWT guard. No end-to-end tests yet.
