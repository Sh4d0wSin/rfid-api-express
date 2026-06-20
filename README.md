# rfid-api-express

REST API for RFID tag, location, and scan tracking built with Node.js, Express, TypeScript, Prisma and PostgreSQL.

## Tech Stack

- **Node.js + Express** — HTTP server and routing
- **TypeScript** — strict type safety end-to-end
- **Prisma** — type-safe database client and migrations
- **PostgreSQL** — relational database (runs via Docker)
- **Docker Compose** — local Postgres setup with one command

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/Sh4d0wSin/rfid-api-express.git
cd rfid-api-express

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.example .env

# 4. Start Postgres
docker compose up -d

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Start dev server
npm run dev
```

API is available at `http://localhost:3000`.

## API Endpoints

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tags` | List all tags |
| `GET` | `/api/tags/:id` | Get a tag with last 10 scans |
| `POST` | `/api/tags` | Create a tag |
| `PUT` | `/api/tags/:id` | Update a tag |
| `DELETE` | `/api/tags/:id` | Delete a tag |
| `POST` | `/api/tags/:id/scan` | Record a scan for a tag |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |

## Example Requests

**Create a tag**
```json
POST /api/tags
{ "label": "TAG-001", "status": "ACTIVE" }
```

**Record a scan**
```
POST /api/tags/:id/scan
```

**Tag status values:** `ACTIVE` · `INACTIVE` · `LOST`

## Data Models

- **Tag** — `id`, `label`, `status`, `lastScanned`, `locationId`
- **Location** — `id`, `name`
- **Scan** — `id`, `tagId`, `locationId`, `scannedAt`

## Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled output
npx prisma studio    # Open database GUI
```
