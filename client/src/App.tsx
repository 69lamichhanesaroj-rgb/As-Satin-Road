import "./index.css";

/*
 * TODO #11 (Asim)
 * Generate the API client and make ONE api object the whole app uses.
 * 1. In package.json, change the "generate:api" script to:
 *    bunx swagger-typescript-api generate --path http://localhost:5000/swagger/v1/swagger.json
 *      --clean-output --output ./src/api --unwrap-response-data --extract-request-params
 * 2. Start the API, then run: bun run generate:api  (Api.ts gets made again)
 * 3. New small file src/apiClient.ts with 1 line: export const api = new Api({ baseUrl: ... })
 *    baseUrl = http://localhost:5000 while developing, the live Fly url in production (#27)
 * Why: every page imports "api" from apiClient.ts and calls the backend through it,
 * with real types, so typos in field names show up as red errors.
 * Run generate:api again every time someone adds or changes an endpoint.
 */


/*
 * TODO #12 (Asim)
 * Pages and navigation with React Router.
 * 1. bun add react-router
 * 2. Here: make a router (createBrowserRouter) with 5 routes, each shows one page from src/pages/:
 *      "/"          -> HomePage      (#18, Rafal)
 *      "/shop"      -> MyShopPage    (#19, Rafal)
 *      "/orders"    -> MyOrdersPage  (#21, Saroj)
 *      "/admin"     -> AdminPage     (#16, Asim)
 *      "/login"     -> LoginPage     (#13, Saroj)
 * 3. App returns <RouterProvider router={...} /> instead of the welcome text below.
 * 4. A small nav bar with a link to each page (Link from react-router).
 * The pages can stay almost empty, each person fills their own page.
 * Why: the admin and normal users need different screens, and each page has its own url.
 */




















export function App() {
    return (
        <div className="app">
            <h1>Satin Road</h1>
            <p>Welcome to Satin Road.</p>
        </div>
    );
}

export default App;