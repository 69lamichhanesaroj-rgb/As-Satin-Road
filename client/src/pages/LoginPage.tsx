/*
 * TODO #13 (Saroj)
 * Component: LoginPage (export it, App.tsx uses it for the "/login" route)
 * Takes no props.
 * Steps:
 *   1. Two inputs: username and password (keep them in state)
 *   2. A "Log in" button -> api Login -> save the user that comes back (id, name, role)
 *      e.g. in localStorage, so every page knows who is logged in -> go to the home page
 *   3. A "Register" button -> api Register -> then log in the same way
 *   4. Show the error from the backend, e.g. "Wrong username or password"
 *   5. A "Log out" button somewhere (nav bar) that clears the saved user
 * Why: my shop, my orders, buying and the admin page all need to know who the user is.
 * Flow: this page -> api (Api.ts) -> UserController -> UserService -> database
 */




































