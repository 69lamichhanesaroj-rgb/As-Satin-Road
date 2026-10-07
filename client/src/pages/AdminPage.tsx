import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";
import type { Category } from "../api/Api";
import { CategoryIcon } from "../components/CategoryIcon";
import { Empty } from "../components/Empty";
import { getSavedUser } from "../user";

export function AdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");
    // the category whose Delete was clicked once and now asks "Really delete?"
    const [confirmingId, setConfirmingId] = useState<number | null>(null);

    const user = getSavedUser();
    const navigate = useNavigate();

    // get the list from the backend and keep it in state
    function loadCategories() {
        api.api.categoryGetCategories().then(r => setCategories(r)).catch(showError);
    }

    // load once when the page opens
    // hooks always have to run, so this comes before the "admins only" check below
    useEffect(() => {
        loadCategories();
    }, []);

    // the backend sends the reason in "detail", the generated client puts it in e.error
    function showError(e: any) {
        setError(e.error?.detail ?? "Something went wrong");
    }

    // only an admin sees the page, the backend checks it again on every call
    if (!user) {
        return (
            <div>
                <div className="page-head">
                    <h2>Categories</h2>
                </div>
                <Empty text="Log in first.">
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>Log in</button>
                </Empty>
            </div>
        );
    }
    if (user.role !== "admin") {
        return (
            <div>
                <div className="page-head">
                    <h2>Categories</h2>
                </div>
                <Empty text="Admins only." />
            </div>
        );
    }
    const userId = user.id;

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
        setConfirmingId(null); // clicking anything else takes back the "Really delete?"
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
        // first click arms the button, second click really deletes (same as in My shop)
        if (confirmingId !== id) {
            setConfirmingId(id);
            return;
        }
        setConfirmingId(null);
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
            {/* the title bar: the title, and adding a category on the right */}
            <div className="page-head">
                <h2>Categories</h2>
                <div className="row">
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category" />
                    <button className="btn btn-primary" onClick={addCategory}>Add</button>
                </div>
            </div>
            {error && <p className="error">{error}</p>}
            {categories.length === 0 ? (
                <Empty text="No categories yet." />
            ) : (
                <ul className="panel list">
                    {categories.map(c =>
                        <li key={c.categoryId} className="list-item">
                            <span className="list-name">
                                <CategoryIcon id={c.categoryId ?? 0} name={c.categoryName ?? "?"} size={36} />
                                {c.categoryName}
                            </span>
                            <div className="actions">
                                <button className="btn" onClick={() => renameCategory(c.categoryId!)}>Rename</button>
                                <button className="btn btn-danger" onClick={() => deleteCategory(c.categoryId!)}>
                                    {confirmingId === c.categoryId ? "Really delete?" : "Delete"}
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
