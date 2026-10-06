import { useEffect, useState } from "react";
import { api } from "../apiClient";
import type { Category } from "../api/Api";

function getSavedUser(): { id: string; username: string; role: string } | null {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");

    const user = getSavedUser();

    // TODO #14 frontend guard: only admin sees the page
    if (!user) {
        return <p>log in first</p>;
    }
    if (user.role !== "admin") {
        return <p>admins only</p>;
    }

    return <AdminInner userId={user.id} categories={categories} setCategories={setCategories} newName={newName} setNewName={setNewName} error={error} setError={setError} />;
}

// inner component so hooks run unconditionally after the guard above
function AdminInner({ userId, categories, setCategories, newName, setNewName, error, setError }: {
    userId: string;
    categories: Category[];
    setCategories: (c: Category[]) => void;
    newName: string;
    setNewName: (s: string) => void;
    error: string;
    setError: (s: string) => void;
}) {
    function loadCategories() {
        api.api.categoryGetCategories().then(r => setCategories(r)).catch(showError);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    // the backend sends the reason in "detail", the generated client puts it in e.error
    function showError(e: any) {
        setError(e.error?.detail ?? "Something went wrong");
    }

    async function addCategory() {
        try {
            await api.api.categoryCreateCategory({ userId }, newName);
            setNewName("");
            setError("");
            loadCategories();
        } catch (e: any) {
            showError(e);
        }
    }

    async function renameCategory(id: number) {
        const name = prompt("New name:");
        if (!name) return;
        try {
            await api.api.categoryRenameCategory({ userId }, { categoryId: id, newName: name });
            setError("");
            loadCategories();
        } catch (e: any) {
            showError(e);
        }
    }

    async function deleteCategory(id: number) {
        try {
            await api.api.categoryDeleteCategory({ categoryId: id, userId });
            setError("");
            loadCategories();
        } catch (e: any) {
            showError(e);
        }
    }

    return (
        <div>
            <h2>Admin: categories</h2>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category" />
            <button onClick={addCategory}>Add</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {categories.map(c =>
                    <li key={c.categoryId}>
                        {c.categoryName}
                        <button onClick={() => renameCategory(c.categoryId!)}>Rename</button>
                        <button onClick={() => deleteCategory(c.categoryId!)}>Delete</button>
                    </li>
                )}
            </ul>
        </div>
    );
}
