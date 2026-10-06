import "./index.css";
import { Outlet, useNavigate } from "react-router";
import { useState } from "react";

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
    const [user, setUser] = useState(getSavedUser);

    function handleLogout() {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    }

    function go(path: string) {
        setUser(getSavedUser());
        navigate(path);
    }

    return (
        <div className="app">
            <h1>Satin Road</h1>
            <nav>
                <button onClick={() => go('/')}>Home</button>
                <button onClick={() => go('/shop')}>My shop</button>
                <button onClick={() => go('/orders')}>My orders</button>
                <button onClick={() => go('/admin')}>Admin</button>
                {user ? (
                    <>
                        <span>Logged in as {user.username} ({user.role})</span>
                        <button onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <button onClick={() => go('/login')}>Log in</button>
                )}
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
