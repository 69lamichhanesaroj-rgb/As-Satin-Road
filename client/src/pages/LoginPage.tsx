/*
 * TODO #13 (Saroj)
 * Component: LoginPage (export it, App.tsx uses it for the "/login" route)
 * Takes no props.
 * Steps:
 *   1. Two inputs: username and password (keep them in state)
 *   2. A "Log in" button -> api Login -> save the user that comes back (id, name, role)
 *      e.g. in localStorage, so every page knows who is logged in -> go to the home page
 *   3. A "Register" button -> api Register -> then log in the same way
 *   4. Show the error from the backend, e.g. "Wrong username or password"
 *   5. A "Log out" button somewhere (nav bar) that clears the saved user
 * Why: my shop, my orders, buying and the admin page all need to know who the user is.
 * Flow: this page -> api (Api.ts) -> UserController -> UserService -> database
 */


import {useState} from "react";
import {login,register} from "../apiClient";


export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    
    
    async function handleLogin() {
        try {
            setError("");
            setMessage("");
            
            const loggedInUser = await login(username, password);
            
            localStorage.setItem("user", JSON.stringify(loggedInUser));
            
            setMessage(`Welcome ${loggedInUser.username}!`);
        } catch (error) {
            setError(error instanceof Error
            ? error.message
            : "Login failed");
        }
    }
    
    async function handleRegister() {
        try {
            setError("");
            setMessage("");
            
            const newUser = await register(username, password);
            
            localStorage.setItem("user", JSON.stringify(newUser));
            
            setMessage(`Account created, welcome ${newUser.username}!`);
            
        } catch (error) {
            setError(error instanceof Error
            ? error.message
            : "Registration failed");
        }
    }
    
    return (
        <div>
            <h1>Login</h1>
            
            <input
                type="text"
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
            {error && (
            <p>{error}</p>)}

            {message && (<p>{message}</p>)}
        </div>
        
    );
    
    
    
}
export default LoginPage;



































