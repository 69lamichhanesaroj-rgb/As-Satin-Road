import "./index.css";

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