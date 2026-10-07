# Satin Road

A parody dark web marketplace. Users can sell and buy products, an admin manages the categories.
School project by Asim, Saroj and Rafal.

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

TODO #29 (Rafal): Lighthouse scores + what we changed to make the app lighter.
