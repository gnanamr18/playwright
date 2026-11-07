# Playright — learn Playwright with a tiny fullstack app

A simple **login + profile** app so you can learn **Playwright** end-to-end testing.

| Layer | Tech |
| --- | --- |
| Frontend | React + Vite |
| Backend | Express |
| Database | PostgreSQL + Prisma |
| Tests | Playwright |

## Demo accounts (hardcoded)

| Username | Password |
| --- | --- |
| `alice` | `alice123` |
| `bob` | `bob123` |

Passwords live in `backend/src/users.js` — **not** in the database. Postgres only stores profile fields (age, address, mobile).

## 1. Create the database (pgAdmin)

1. Open pgAdmin
2. Create a database named `playright_db`
3. Copy env file and fill in your Postgres username/password:

```bash
cd backend
cp .env.example .env
```

Example `.env`:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/playright_db"
JWT_SECRET="any-secret-you-like"
```

## 2. Install + set up backend

```bash
cd backend
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Backend: http://localhost:4000

## 3. Install + run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## 4. Unit tests (Jest) vs e2e tests (Playwright)

| | Jest (unit) | Playwright (e2e) |
| --- | --- | --- |
| File | `backend/src/users.test.js` | `e2e/auth.spec.js` |
| What it tests | One function: `findHardcodedUser` | Full login/profile flow in a browser |
| Needs server/DB/UI? | No | Yes (backend + frontend) |
| Speed | Very fast | Slower |

### Run Jest (no app needed)

```bash
# from project root
npm run test:unit

# or from backend/
cd backend
npm test
```

### Run Playwright

With the **backend already running**, from the project root:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Useful commands:

```bash
# Watch tests in Playwright UI (great for learning)
npm run test:e2e:ui

# Run one file
npx playwright test e2e/auth.spec.js
```

### What Playwright covers

1. Wrong password → error message  
2. Correct login → welcome screen  
3. Save profile → success message → logout back to login  

Open `e2e/auth.spec.js` and `backend/src/users.test.js` side by side to compare styles.

## Project map

```
playright/
  backend/          Express API + Prisma
  frontend/         React UI
  e2e/              Playwright tests
  playwright.config.js
```

## API quick reference

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/login` | no | Login, returns JWT |
| GET | `/api/me` | yes | Current user profile |
| PUT | `/api/profile` | yes | Save age / address / mobile |
