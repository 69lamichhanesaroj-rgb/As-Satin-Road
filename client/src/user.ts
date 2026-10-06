// The logged-in user, saved by the login page. Null when logged out.
export type SavedUser = {
    id: string;
    username: string;
    role: string;
};

export function getSavedUser(): SavedUser | null {
    try {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as SavedUser) : null;
    } catch {
        return null;
    }
}
