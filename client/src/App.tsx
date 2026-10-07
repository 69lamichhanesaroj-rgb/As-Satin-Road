import "./index.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getSavedUser } from "./user";
import logoSr from "./logo-sr.svg";

export function App() {
    const navigate = useNavigate();
    // useLocation makes App render again every time the page changes,
    // so the nav reads the saved user again right after log in or log out
    const location = useLocation();
    const user = getSavedUser();
    // is the account menu (under the round letter button) open?
    const [menuOpen, setMenuOpen] = useState(false);

    // Escape closes the account menu, the same way it closes the product window
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // the link for the page we're on gets the "active" class (gold)
    function navClass(base: string, path: string) {
        return location.pathname === path ? base + " active" : base;
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
                    <img className="brand-mark" src={logoSr} alt="" />
                    <span className="wordmark">SATIN ROAD</span>
                </button>
                <nav className="nav">
                    {/* everyone can look around the market, logged in or not */}
                    <button className={navClass('nav-link', '/shopping')} onClick={() => go('/shopping')}>Shopping</button>
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
                                            <button className={navClass('user-menu-item', '/shop')} onClick={() => go('/shop')}>My shop</button>
                                            <button className={navClass('user-menu-item', '/orders')} onClick={() => go('/orders')}>My orders</button>
                                            {/* only the admin sees this link, the server checks the role too */}
                                            {user.role === "admin" && (
                                                <button className={navClass('user-menu-item', '/admin')} onClick={() => go('/admin')}>Dashboard</button>
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
                    <Outlet />
                </main>
            </div>
            <footer className="footer">
                <img src={logoSr} alt="" />
                Satin Road is a school project. Nothing here is real or for sale.
            </footer>
        </div>
    );
}

export default App;
