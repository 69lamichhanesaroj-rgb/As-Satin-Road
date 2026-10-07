/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./App";
import { HomePage } from "./pages/HomePage";
import { MyShopPage } from "./pages/MyShopPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// App is the parent (title + nav), the pages are its children and show in its <Outlet />
// index: true = the page for "/" itself
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <MyShopPage /> },
      { path: "orders", element: <MyOrdersPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "login", element: <LoginPage /> },
      // every other address
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
