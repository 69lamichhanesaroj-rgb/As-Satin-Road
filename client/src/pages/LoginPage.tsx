import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            setError("");
            // POST /api/User/Login -> { id, username, role } - note lowercase from C# Id->id
            const me = await api.api.userLogin({ username, password });
            // app knows who you are: every page reads this
            localStorage.setItem("user", JSON.stringify(me));
            navigate("/");
        } catch (e: any) {
            // the backend sends the reason in "detail", the generated client puts it in e.error
            setError(e.error?.detail ?? "Login failed");
        }
    }

    async function handleRegister() {
        try {
            setError("");
            const me = await api.api.userRegister({ username, password });
            localStorage.setItem("user", JSON.stringify(me));
            navigate("/");
        } catch (e: any) {
            setError(e.error?.detail ?? "Register failed");
        }
    }

    return (
        <div>
            <h2>Log in</h2>
            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
