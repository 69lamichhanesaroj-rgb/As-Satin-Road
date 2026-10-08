# Satin Road

A parody dark web marketplace. Users can sell and buy products, an admin manages the categories.
School project by Asim, Saroj and Gabriela.

Hard stories we built:
- 20% discount when a buyer has more than 10 earlier orders from the same seller
- sellers with more than 100 orders are featured on the Shopping page
- every purchase has a 1% chance that the buyer is the FBI, then the seller gets shut down

## Tech

- Backend: .NET 10, Linq2db, SQLite, Swagger (NSwag)
- Frontend: Bun, React, React Router, a client generated with swagger-typescript-api
- Tests: xUnit
- Docker: `server/API/Dockerfile`, `client/Dockerfile`, and `docker-compose.yml` that starts both

```
server/
  API/            controllers + Program.cs
  Service/        the logic (UserService, ListingService, OrderService, CategoryService)
  Infra/          database connection + entities
  Service.Tests/  the tests
client/
  src/pages/      one file per page
  src/components/ Modal and CategoryIcon
  src/api/Api.ts  generated, don't edit by hand
  src/apiClient.ts  the one "api" object every page uses
  src/logo.svg    the S on a tile, only the icon in the browser tab
  src/logo-sr.svg our logo (S and R), in the header, home banner, login and footer
```

## How to run

**Backend**

```
cd server/API
dotnet run
```

Swagger: http://localhost:5000/swagger

The database file `dev.db` is made automatically the first time. It's not in git, everyone has their own.
If the tables change, delete `dev.db` and start the API again.

**Frontend** (in a second terminal, the API has to run)

```
cd client
bun install
bun dev
```

App: http://localhost:3000

**With Docker** (the whole app with one command, Docker Desktop has to run)

```
docker compose up --build
```

App: http://localhost:3000, API + Swagger: http://localhost:5000/swagger

The API runs inside its container on port 8080, `docker-compose.yml` maps it to 5000 so the client works the same as in dev.
The database is kept in a Docker volume, so it survives a restart. `docker compose down -v` deletes it.
Stop the API in Rider and `bun dev` first, they use the same ports.

**After changing an endpoint**, make the client again (the API has to run):

```
cd client
bun run generate:api
```

## Using the app

1. Register. **The first user who registers is the admin**, everyone after is a normal user.
2. As the admin, click your letter in the top right and open Dashboard to add some categories. Only the admin can add, rename or delete them.
3. Log out, register a second user and add listings on My shop (also in the menu under your letter).
4. Register a third user and buy something on the Shopping page. My orders shows what you bought.

To start over with an empty database, delete `dev.db` (with Docker: `docker compose down -v`).

**Demo data.** One command deletes everything in `dev.db` and fills it with demo data (`server/API/DemoData.cs`).
Stop the API first, then:

```
cd server/API
dotnet run -- seed
```

Every demo account has the password `12345`:

| Username | Role |
|---|---|
| asim@gmail.com | admin |
| samir@gmail.com, oliver@gmail.com | buy and sell (samir has 12 orders from heisenberg, the last one with 20% off) |
| emma@gmail.com, lucas@gmail.com | buyers |
| heisenberg@gmail.com, blackbeard@gmail.com | featured sellers (more than 100 sales) |
| indiana@gmail.com, gringotts@gmail.com | sellers |

There are 6 categories and 17 listings. Start the API again with `dotnet run` afterwards.

## Tests

```
cd server
dotnet test Service.Tests
```

Or in Rider: right click `Service.Tests` -> Run Unit Tests.

### Our methodology: TDD

For new logic we write the test first, see it fail (red), then write the code until it passes (green).
We commit both steps, so you can see it in the git history.

Example: the 20% discount (issue #22)

1. Red: we wrote the tests and an empty `CalculateTotalPrice` that only throws `NotImplementedException`.
   All 3 tests failed. Commit `89160f7` "add discount tests (red)"
2. Green: we wrote the method. All tests passed. Commit `3116b16` "add discount method, tests green"

```csharp
[Theory]
[InlineData(100, 1, 10, 100)]   // exactly 10 -> no discount yet
[InlineData(100, 1, 11, 80)]    // 11 -> 20% off
[InlineData(50, 2, 0, 100)]     // first order -> price x quantity
public void CalculateTotalPrice_Discount(int price, int quantity, int earlierOrders, int expected)
```

### What we test and why

We test the rules where a mistake would really hurt: money, stock and the hard stories.
Each test is arrange (put data in) -> act (call the method) -> assert (check the result).

| What | Tests |
|---|---|
| 20% discount | 10 orders full price, 11 orders 20% off, first order |
| Featured sellers | 100 is not featured, 101 is, shut down sellers are never featured |
| Create listing | unknown seller, shut down seller, price 0, valid listing has category + seller name |
| Place order | quantity 0 or negative, listing not found, not enough stock, buying your own listing |
| FBI raid | random 1 -> seller shut down and listings gone, random 50 -> normal order |

**Test database:** tests that need the database use `TestDatabase.Create()`. It makes a fresh in-memory
SQLite database for every test, so tests don't affect each other or `dev.db`.

**Small methods are easy to test:** rules like the discount (`CalculateTotalPrice`) and featured (`IsFeatured`)
are their own small methods without the database, so a test can call them directly.

**Why the database tests matter:** once a query used a C# method inside `.Where(...)`. It compiled fine,
but Linq2db can't turn a C# method into SQL, so it crashed when it ran. A test on a real database catches that.

## Sustainability (Lighthouse)

We ran Lighthouse on the home page against a production build:

```
bun run build && bun run start
```
and
```
lighthouse http://localhost:3000/ --only-categories=performance,accessibility,best-practices,seo --preset "desktop"
```

**Before** (production build):

| Category | Score |
|---|---|
| Performance | 74 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 92 |

**What we changed**

- `client/src/index.ts`: served a real `/robots.txt`. The `/*` SPA fallback was returning
  `index.html` for it, so Lighthouse read the homepage as robots.txt and reported 18 errors.
  This fixed the only failing SEO audit.
- `client/src/pages/HomePage.tsx`: gave the hero image explicit `width`/`height` and
  `fetchpriority="high"` (it is the LCP image and its missing size was one of the two layout shifts).

**After**

| Category | Score |
|---|---|
| Performance | 75 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | **100** |

SEO improved from **92 to 100** thanks to the robots.txt route. Performance only moved
from **74 to 75**: it is held back by Cumulative Layout Shift, which stayed at **~0.84** and is
nearly the whole penalty. Lighthouse points the remaining shift at the top-level `.app` container.

**After the polish (#71)**

We ran Lighthouse again on the new home page, in Chrome DevTools (Incognito, Desktop), against the production server:

```
cd client
bun run start
```
(on Windows PowerShell with another port: `$env:PORT=4000; bun run start`, then open http://localhost:4000)

| Category | Score |
|---|---|
| Performance | **98** |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

What made the difference:

- The big layout shift came from the old home page: it showed "Loading..." first and then swapped in
  the whole page with the listings. The listings moved to the Shopping page, so the home page has
  nothing to load and shows the banner straight away. Layout shift went from ~0.84 to 0.
- Every page only fades in now (no slide), so a full screen page is never taller than the screen
  for a moment (that also made a scrollbar flash).
- Every image has a width and height, so the browser keeps the space free before it loads.
- Test the production server, not `bun dev`. The dev server sends 1.7 MB of JavaScript that is
  not minified and not cached. Production sends about 330 KB, minified and cached for a year.

What is still yellow: the Google Fonts stylesheet blocks the first paint for about 0.3 s.
Downloading the two fonts into the project would fix it.
