# Pynea assignment: Pokemon Explorer

A small full-stack app that lets you browse and search Pokemon, built as a GraphQL
abstraction layer (NestJS) over the public [PokeAPI](https://pokeapi.co), consumed
by a Next.js frontend.

> **Note on API choice:** the brief lists REST Countries as an option (my personal choice), 
> but its legacy `v3.1` API has since been deprecated and the new `v5` API requires an
> auth key - which would violate the "no API key required" requirement. I
> switched to PokeAPI instead, which stays fully keyless and maps cleanly onto
> the same list/search/detail shape (`pokemonList`, `searchPokemon`, `pokemon`).

## Project structure

```
backend/                 NestJS + GraphQL API
  src/pokemon/
    domain/               internal GraphQL models
    dto/                  query argument shapes
    infrastructure/       PokeAPI adapter, mapper, and types
    pokemon-data-source.ts, pokemon.service.ts, pokemon.resolver.ts, pokemon.module.ts
frontend/                Next.js (App Router)
  app/                    pages, plus loading/error/not-found boundaries
  e2e/                    Playwright spec
  lib/                    GraphQL transport + query definitions
  components/             SearchBar, PokemonCard, Pagination, BackToListLink
.github/workflows/ci.yml
docker-compose.yml
```

See the file-level comments and `Architecture overview` below for what each piece does.

## Architecture overview

**Backend - ports & adapter**

The backend uses a lightweight ports and adapters approach. The main goal was to keep it independent from PokeAPI and its payload response format

- `PokemonDataSource` (`pokemon-data-source.ts`) is the interface for all data the app needs. It exposes `findAll`, `findByName` and `search` (the first and last return a paginated envelope). `PokemonService` depends on this interface rather than directly on PokeAPI or native `fetch`.
- `PokeApiDataSource` implements `PokemonDataSource` and is the only interaction with PokeAPI. It passes the responses onto `PokeApiMapper`, which then converts PokeAPI's response format into our internal domain `Pokemon` model.
- `PokemonResolver` is only responsible for handling the GraphQL layer and then delegating to `PokemonService`, it contains no app logic of its own

**Frontend - server components and a small transport layer**

The frontend uses server components for data fetching. `app/page.tsx` and `app/pokemon/[name]/page.tsx` call query functions from `lib/queries.ts`

Similar to the backend, the only interaction with the HTTP layer is done in one place: `lib/graphql-client.ts`. I deliberately didn't use Apollo due to there only being a handful of queries, and the use case didn't require the additional client side caching/state management apollo provided

Search and pagination were deliberately done as URL query params (`/?q=charizard&page=1`) rather than being stored in local state so results could be shared/bookmarkable

## Design patterns used

- **Ports & Adapters / Dependency Inversion**: `PokemonDataSource` is the port and `PokeApiDataSource` is the adapter. `PokemonService` depends on the abstraction, keeping it independent from PokeAPI.
- **Mapper**: `PokeApiMapper` converts PokeAPI responses into the application's `Pokemon` model, keeping external API details isolated
- **Composition root**: `PokemonModule` wires `PokemonDataSource` to `PokeApiDataSource`, keeping dependency configuration in one place.

## Testing

There are three layers of tests, aimed at logic rather than coverage numbers.

**Backend** (`cd backend && npm test`) - covers `PokemonService`'s pagination, and the PokeAPI-to-domain mapping (including the sprite fallback chain).

**Frontend unit tests** (`cd frontend && npm test`) - covers the GraphQL transport's error handling, and rendering/behavior of the search bar and pagination components.

**Frontend e2e** (`cd frontend && npm run test:e2e`) - a single Playwright spec that boots the stack together against the real PokeAPI and walks the actual user flow: load the list, search, open a detail page, navigate back, and hit a not-found path for an unknown Pokemon.

## Trade-offs / what was intentionally simplified

- **PokeAPI has no name-search endpoint**, so `search()` works around it: pull the full name/URL catalog in one request (`SEARCH_CATALOG_SIZE = 1500` - the real catalog is ~1350, so there's some headroom), filter in-memory, then fetch full details only for whichever page of matches got requested
- **Backend caching is a simple in-memory, lazily-populated cache** keyed by Pokemon name (`detailCache` in `PokeApiDataSource`). Individual Pokemon detail data is static, and without caching, `findAll`/`search` would re-fetch every detail on every request, capped only at however many results are being viewed per page (i.e. N+1 requests per page, where N is page size). Caching details as they're fetched means a name only ever needs one real PokeAPI detail lookup, however many times it's later requested via list, search, or its own detail page. As it's static data there's no eviction process. I didn't fetch on startup as there are ~1350 Pokemon, which would drastically increase startup times and would be overkill for such a simple project.

- **Minimal styling**, vanilla CSS was chosen as there were only a small amount of components, otherwise I would've used a UI library

## What would be improved with more time

- The caching layer is thin and simple purposefully at the moment. The DTO's are stored rather than in-flight promises, so concurrent first time requests for the same uncached name each trigger their own PokeAPI fetch, instead of being shared. This is fine as is due to network traffic being low, but caching the promise would dedupe concurrent requests. In the 'real world' if this was deployed with multiple instances with a large data set I'd consider something like redis for sharing this cached state

- Have `search()` page through PokeAPI's `next` links instead of a fixed catalog-size constant, so it's correct regardless of how large the catalogue grows and doesn't need manual updating.

- Using a graphQL library like Apollo/urql/tanstack. With the simplicity of the project there isn't a need but as the project expanded I would make the switch (easily achievable due to design of `frontend\lib\graphql-client.ts`)

## CI

`.github/workflows/ci.yml` runs on every push/PR: backend lint + build + unit tests, frontend lint + unit tests, and an e2e job that boots both apps and runs the Playwright spec against them.

## Running the project

### Option A - Docker (recommended)

Requires Docker + Docker Compose.

```bash
docker compose up --build
```

- Backend GraphQL API: `http://localhost:4000/graphql`
- Frontend: `http://localhost:3000`

The frontend container talks to the backend container over the internal
Docker network (`http://backend:4000/graphql`, set in `docker-compose.yml`);
no manual wiring needed. `docker compose down` to stop and remove.

### Option B - Locally with Node

Requires Node.js 18+.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env   # optional — defaults already point at the public PokeAPI
npm run start:dev
```

The GraphQL API is served at `http://localhost:4000/graphql` - open that URL
in a browser for the Apollo sandbox, where you can explore the schema and run
queries directly.

**2. Frontend**

```bash
cd frontend
npm install
cp .env.example .env   # GRAPHQL_URL, defaults to http://localhost:4000/graphql
npm run dev
```

Visit `http://localhost:3000`. The backend must be running first.

### Running tests

```bash
cd backend && npm test
cd frontend && npm test
cd frontend && npm run test:e2e   # boots both apps itself, needs Node 18+
```

### Linting

```bash
cd backend && npm run lint
cd frontend && npm run lint
```
