/*
 * TODO #18 (Rafal)
 * Component: HomePage (export it, frontend.tsx uses it for the "/" route)
 * Takes no props.
 * Steps: when the page opens (useEffect), load the active listings and the categories through "api"
 *        -> keep them in state (useState)
 *        -> show each listing: title, price, stock, category name, seller name
 *        -> a dropdown with the categories: pick one -> only listings of that category show
 * Why: this is the landing page, the first thing everyone sees.
 * Flow: this page -> api (Api.ts) -> ListingController.GetActiveListings -> ListingService
 */




















/*
 * TODO #18 (Rafal)
 * Featured vendors at the top of this page (the backend part was done in #23).
 * Load the featured vendors through "api" (UserController.GetTopVendors)
 * and show them in a box above the listings, e.g. "Featured sellers: ..."
 * Why: hard story, vendors with more than 100 orders are featured on the landing page.
 */











/*
 * TODO #20 (Rafal)
 * Buy a product, on each listing:
 * a number input for the quantity + a Buy button
 * -> the button calls api (OrderController.PlaceOrder) with the logged-in user's id, the listing id and the quantity
 * -> show the message that comes back: normal order, 20% discount, or FBI raid
 * -> load the listings again, so the new stock shows
 * If the user isn't logged in, show "log in to buy" instead of the button (#13 keeps the user).
 */

// placeholder so the route works, write your page inside this function
export function HomePage() {
    return <h2>Home</h2>;
}
