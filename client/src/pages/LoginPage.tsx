import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";
import logoSr from "../logo-sr.svg";

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
        <div className="auth">
            <div className="panel">
                <img className="auth-logo" src={logoSr} alt="" width={112} height={92} />
                <h2>Welcome back</h2>
                <p className="subtitle">Log in, or make a new account.</p>
                <label className="field">
                    Username
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label className="field">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {error && <p className="error">{error}</p>}
                <div className="buy-row">
                    <button className="btn btn-primary" onClick={handleLogin}>Log in</button>
                    <button className="btn" onClick={handleRegister}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
