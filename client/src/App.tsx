import "./index.css";
import { Outlet, useLocation, useNavigate } from "react-router";

function getSavedUser(): { id: string; username: string; role: string } | null {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

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
            <h1>Satin Road</h1>
            <nav>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/shop')}>My shop</button>
                <button onClick={() => navigate('/orders')}>My orders</button>
                <button onClick={() => navigate('/admin')}>Admin</button>
                {user ? (
                    <>
                        <span>Logged in as {user.username} ({user.role})</span>
                        <button onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/login')}>Log in</button>
                )}
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
