/*
 * TODO #16 (Asim)
 * Component: AdminPage (export it, App.tsx uses it for the "/admin" route)
 * Takes no props. Only for a user with role "admin" (#13, #14), else show "admins only".
 * Steps:
 *   1. Load the categories through "api" (CategoryController.GetCategories) -> keep them in state
 *   2. A text input + "Add" button -> api CreateCategory -> load the list again
 *   3. On each category: a rename button (asks for the new name) -> api RenameCategory
 *      and a delete button -> api DeleteCategory -> load the list again
 *   4. Show the error from the backend, e.g. "Category is still used by listings"
 * Why: user story "an administrator can manage categories".
 * Flow: this page -> api (Api.ts) -> CategoryController -> CategoryService -> database
 */


































