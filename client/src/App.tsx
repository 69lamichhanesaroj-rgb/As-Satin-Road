import "./index.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { api } from "./apiClient";
import type { Category } from "./api/Api";
import { getSavedUser } from "./user";
import logoSr from "./logo-sr.svg";

// what App gives to the page inside the <Outlet />: the search from the header.
// the Shopping page reads it with useOutletContext()
export type ShopSearch = {
    query: string;
    category: number | null; // null = all categories
};

export function App() {
    const navigate = useNavigate();
    // useLocation makes App render again every time the page changes,
    // so the nav reads the saved user again right after log in or log out
    const location = useLocation();
    const user = getSavedUser();
    // is the account menu (under the round letter button) open?
    const [menuOpen, setMenuOpen] = useState(false);

    // the search in the header: the text, the chosen category and the names for the dropdown
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const search: ShopSearch = { query, category };

    // Escape closes the account menu, the same way it closes the product window
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // the search is only in the header on the Shopping page
    const onShoppingPage = location.pathname === "/shopping";

    // load the category names every time the Shopping page opens,
    // so a category the admin just added shows up in the dropdown
    useEffect(() => {
        if (location.pathname !== "/shopping") return;
        async function loadCategories() {
            try {
                setCategories(await api.api.categoryGetCategories());
            } catch {
                setCategories([]); // the dropdown only has "All categories", the search still works
            }
        }
        loadCategories();
    }, [location.pathname]);

    // the menu item for the page we're on gets the "active" class (gold)
    function navClass(path: string) {
        return location.pathname === path ? "user-menu-item active" : "user-menu-item";
    }

    // go to a page and close the account menu
    function go(path: string) {
        setMenuOpen(false);
        navigate(path);
    }

    function handleLogout() {
        localStorage.removeItem("user");
        go("/login");
    }

    return (
        <div className="app">
            <header className="header">
                {/* the logo is the home link */}
                <button className="brand" onClick={() => go('/')}>
                    {/* width/height on every image: the browser keeps the space free before it loads (Lighthouse) */}
                    <img className="brand-mark" src={logoSr} alt="" width={30} height={25} />
                    <span className="wordmark">SATIN ROAD</span>
                </button>
                {/* category + search, only on the Shopping page. The list filters while you type */}
                {onShoppingPage && (
                    <form className="header-search" onSubmit={(e) => e.preventDefault()}>
                        <select
                            aria-label="Category"
                            value={category ?? ""}
                            onChange={(e) => setCategory(e.target.value === "" ? null : Number(e.target.value))}
                        >
                            <option value="">All categories</option>
                            {categories.map((c) => (
                                <option key={c.categoryId} value={c.categoryId}>
                                    {c.categoryName}
                                </option>
                            ))}
                        </select>
                        <input
                            aria-label="Search listings"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">Go</button>
                    </form>
                )}
                <nav className="nav">
                    {/* the way to the shop from the other pages (Home has its own Start shopping button) */}
                    {location.pathname !== '/' && !onShoppingPage && (
                        <button className="btn" onClick={() => go('/shopping')}>Shopping</button>
                    )}
                    {user ? (
                        <div className="account">
                            {/* the first letter of the username in a circle, opens the menu */}
                            <button
                                className="avatar"
                                aria-label="Account menu"
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((open) => !open)}
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </button>
                            {menuOpen && (
                                <>
                                    {/* an invisible layer over the page: a click outside the menu closes it */}
                                    <div className="menu-cover" onClick={() => setMenuOpen(false)} />
                                    <div className="user-menu">
                                        <div className="user-menu-head">
                                            <b>{user.username}</b>
                                            <span>{user.role}</span>
                                        </div>
                                        <div className="user-menu-links">
                                            <button className={navClass('/shop')} onClick={() => go('/shop')}>My shop</button>
                                            <button className={navClass('/orders')} onClick={() => go('/orders')}>My orders</button>
                                            {/* only the admin sees this link, the server checks the role too */}
                                            {user.role === "admin" && (
                                                <button className={navClass('/dashboard')} onClick={() => go('/dashboard')}>Dashboard</button>
                                            )}
                                        </div>
                                        <button className="user-menu-item" onClick={handleLogout}>Log out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={() => navigate('/login')}>Log in</button>
                    )}
                </nav>
            </header>
            {/* only this part scrolls, the header and footer stay on the screen.
                key = the page path, so every new page starts at the top and fades in again */}
            <div className="scroll" key={location.pathname}>
                <main className="page">
                    {/* the page inside gets the search from the header (only the Shopping page uses it) */}
                    <Outlet context={search} />
                </main>
            </div>
            <footer className="footer">
                <img src={logoSr} alt="" width={19} height={16} />
                Satin Road is a school project. Nothing here is real or for sale.
            </footer>
        </div>
    );
}

export default App;
