const API_URL = "http://localhost:5000";

export async function register(
    username: string,
    password: string
) {
    const response = await fetch(
        `${API_URL}/api/User/Register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Registration failed"
        );
    }

    return response.json();
}

export async function login(
    username: string,
    password: string
) {
    const response = await fetch(
        `${API_URL}/api/User/Login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Login failed"
        );
    }

    return response.json();
}