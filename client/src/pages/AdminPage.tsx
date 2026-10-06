import {useEffect, useState} from "react";
import {api} from "../apiClient";
import type {Category} from "../api/Api";

/*
 * TODO #14 (Saroj)
 * Only an admin may see this page. When login (#13) saves the user,
 * check the role here: if it's not "admin", show "admins only" instead of the page.
 */

export function AdminPage() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");

    // get the list from the backend and keep it in state
    function loadCategories() {
        api.api.categoryGetCategories().then(r => setCategories(r));
    }

    // load once when the page opens
    useEffect(() => {
        loadCategories();
    }, []);

    // the backend sends the reason in "detail", e.g. "Category is still used by listings"
    function showError(e: any) {
        setError(e.error?.detail ?? "Something went wrong");
    }

    async function addCategory() {
        try {
            await api.api.categoryCreateCategory(newName);
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
            await api.api.categoryRenameCategory({categoryId: id, newName: name});
            setError("");
            loadCategories();
        } catch (e: any) {
            showError(e);
        }
    }

    async function deleteCategory(id: number) {
        try {
            await api.api.categoryDeleteCategory({categoryId: id});
            setError("");
            loadCategories();
        } catch (e: any) {
            showError(e);
        }
    }

    return (
        <div>
            <h2>Admin: categories</h2>

            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category"/>
            <button onClick={addCategory}>Add</button>

            {error && <p>{error}</p>}

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
