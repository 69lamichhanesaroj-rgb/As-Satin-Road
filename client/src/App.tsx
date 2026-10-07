import "./index.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getSavedUser } from "./user";
import logo from "./logo.svg";

export function App() {
    const navigate = useNavigate();
    // useLocation makes App render again every time the page changes,
    // so the nav reads the saved user again right after log in or log out
    const location = useLocation();
    const user = getSavedUser();

    // the button for the page we're on gets the "active" class (gold)
    function navClass(path: string) {
        return location.pathname === path ? "nav-link active" : "nav-link";
    }

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="app">
            <header className="header">
                {/* the logo is the home link */}
                <button className="brand" onClick={() => navigate('/')}>
                    <img className="brand-mark" src={logo} alt="" />
                    <span className="wordmark">SATIN ROAD</span>
                </button>
                <nav className="nav">
                    <button className={navClass('/shop')} onClick={() => navigate('/shop')}>My shop</button>
                    <button className={navClass('/orders')} onClick={() => navigate('/orders')}>My orders</button>
                    <button className={navClass('/admin')} onClick={() => navigate('/admin')}>Admin</button>
                    {user ? (
                        <>
                            <span className="user-label"><b>{user.username}</b> ({user.role})</span>
                            <button className="btn" onClick={handleLogout}>Log out</button>
                        </>
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
                <img src={logo} alt="" />
                Satin Road is a school project. Nothing here is real or for sale.
            </footer>
        </div>
    );
}

export default App;
