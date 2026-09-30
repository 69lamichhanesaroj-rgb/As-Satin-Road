/*
 * TODO #19 (Rafal)
 * Component: MyShopPage (export it, App.tsx uses it for the "/shop" route)
 * Takes no props. Only for a logged-in user (#13), else show "log in first".
 * Steps:
 *   1. Load my own listings through "api" (ListingController.GetMyListings with my user id)
 *   2. A form to create a listing: title, price, stock, category (dropdown from the categories)
 *      -> api CreateListing -> load my listings again
 *   3. On each listing: change price/stock -> api UpdateListing, and a delete button -> api DeleteListing
 *   4. Show the error message from the backend if something is wrong (price 0, etc.)
 * Why: user story "a user can create listings and manage their inventory".
 * Flow: this page -> api (Api.ts) -> ListingController -> ListingService -> database
 */





































