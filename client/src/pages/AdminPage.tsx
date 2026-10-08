import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";
import type { Category } from "../api/Api";
import { CategoryIcon } from "../components/CategoryIcon";
import { Empty } from "../components/Empty";
import { Modal } from "../components/Modal";
import { getSavedUser } from "../user";

export function AdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");
    // the category whose Delete was clicked once and now asks "Really delete?"
    const [confirmingId, setConfirmingId] = useState<number | null>(null);
    // the rename window: which category, the new name, and the error inside the window
    const [renaming, setRenaming] = useState<Category | null>(null);
    const [renameText, setRenameText] = useState("");
    const [renameError, setRenameError] = useState("");

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

    // opens the rename window with the old name already in the box
    function openRename(c: Category) {
        setConfirmingId(null); // clicking anything else takes back the "Really delete?"
        setRenaming(c);
        setRenameText(c.categoryName ?? "");
        setRenameError("");
    }

    async function saveRename() {
        if (!renaming) return;
        try {
            await api.api.categoryRenameCategory({ userId }, { categoryId: renaming.categoryId!, newName: renameText });
            setRenaming(null);
            setError("");
            loadCategories();
        } catch (e: any) {
            setRenameError(e.error?.detail ?? "Something went wrong");
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
                                <CategoryIcon name={c.categoryName ?? "?"} size={36} />
                                {c.categoryName}
                            </span>
                            <div className="actions">
                                <button className="btn" onClick={() => openRename(c)}>Rename</button>
                                <button className="btn btn-danger" onClick={() => deleteCategory(c.categoryId!)}>
                                    {confirmingId === c.categoryId ? "Really delete?" : "Delete"}
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            )}

            {/* the rename window, the same kind of window as Edit listing.
                a form, so pressing Enter also saves */}
            {renaming && (
                <Modal label="Rename category" onClose={() => setRenaming(null)}>
                    <h3>Rename category</h3>
                    <form onSubmit={(e) => { e.preventDefault(); saveRename(); }}>
                        <label className="field">
                            Name
                            <input value={renameText} onChange={e => setRenameText(e.target.value)} autoFocus />
                        </label>
                        {renameError && <p className="error">{renameError}</p>}
                        <div className="buy-row">
                            <button className="btn btn-primary" type="submit">Save</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
