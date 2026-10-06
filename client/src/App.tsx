import "./index.css";
import {Outlet, useNavigate} from "react-router";

// the frame around every page: title + nav, the page itself shows where <Outlet /> is
export function App() {

    const navigate = useNavigate();

    return (
        <div className="app">
            <h1>Satin Road</h1>
            <nav>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/shop')}>My shop</button>
                <button onClick={() => navigate('/orders')}>My orders</button>
                <button onClick={() => navigate('/admin')}>Admin</button>
                <button onClick={() => navigate('/login')}>Log in</button>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
