import "./index.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getSavedUser } from "./user";

export function App() {
    const navigate = useNavigate();
    // useLocation makes App render again every time the page changes,
    // so the nav reads the saved user again right after log in or log out
    useLocation();
    const user = getSavedUser();

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="app">
            <header className="header">
                <h1 className="brand">Satin Road</h1>
                <nav className="nav">
                    <button className="btn" onClick={() => navigate('/')}>Home</button>
                    <button className="btn" onClick={() => navigate('/shop')}>My shop</button>
                    <button className="btn" onClick={() => navigate('/orders')}>My orders</button>
                    <button className="btn" onClick={() => navigate('/admin')}>Admin</button>
                    {user ? (
                        <>
                            <span className="user-label">Logged in as {user.username} ({user.role})</span>
                            <button className="btn" onClick={handleLogout}>Log out</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={() => navigate('/login')}>Log in</button>
                    )}
                </nav>
            </header>
            <Outlet />
        </div>
    );
}

export default App;
