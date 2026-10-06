/*
 * TODO #21 (Saroj)
 * Component: MyOrdersPage (export it, frontend.tsx uses it for the "/orders" route)
 * Takes no props. Only for a logged-in user (#13), else show "log in first".
 * Steps: when the page opens, load my orders through "api" (OrderController.GetOrdersByBuyer with my user id)
 *        -> show a list: date, listing, quantity, total price, and "20% off" if a discount was used
 *        -> if the list is empty, show "no orders yet"
 * Why: a normal shop lets you see what you bought.
 * Flow: this page -> api (Api.ts) -> OrderController -> OrderService -> database
 */





















// placeholder so the route works, write your page inside this function
export function MyOrdersPage() {
    return <h2>My orders</h2>;
}
