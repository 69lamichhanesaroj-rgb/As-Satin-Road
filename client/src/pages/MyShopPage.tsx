import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";
import type { Category, ListingDto } from "../api/Api";
import { Modal } from "../components/Modal";
import { getSavedUser } from "../user";

// The modal is either closed, creating a new listing, or editing an existing one.
type ShopModal = { mode: "create" } | { mode: "edit"; listing: ListingDto } | null;

export function MyShopPage() {
    const navigate = useNavigate();
    const user = getSavedUser();

    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modal, setModal] = useState<ShopModal>(null);
    // form fields, kept as text so the inputs stay editable while typing
    const [formTitle, setFormTitle] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formStock, setFormStock] = useState("");
    const [formCategory, setFormCategory] = useState<number | "">("");
    const [modalError, setModalError] = useState("");
    const [saving, setSaving] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    async function load(vendorId: string) {
        try {
            setError("");
            // my listings for the grid, categories for the create dropdown
            const [l, c] = await Promise.all([
                api.api.listingGetMyListings({ vendorId }),
                api.api.categoryGetCategories(),
            ]);
            setListings(l);
            setCategories(c);
        } catch (e: any) {
            // the backend sends the reason in "detail", the generated client puts it in e.error
            setError(e.error?.detail ?? "Could not load your shop");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            load(user.id);
        } else {
            setLoading(false);
        }
    }, []); // [] = run once when the page opens

    function openCreate() {
        setFormTitle("");
        setFormPrice("");
        setFormStock("");
        setFormCategory("");
        setModalError("");
        setConfirmingDelete(false);
        setModal({ mode: "create" });
    }

    function openEdit(l: ListingDto) {
        setFormTitle(l.title ?? "");
        setFormPrice(String(l.price ?? ""));
        setFormStock(String(l.stockQuantity ?? ""));
        setFormCategory("");
        setModalError("");
        setConfirmingDelete(false);
        setModal({ mode: "edit", listing: l });
    }

    async function handleSave() {
        if (!user || !modal) return;
        setSaving(true);
        setModalError("");
        try {
            if (modal.mode === "create") {
                if (formCategory === "") {
                    setModalError("Pick a category.");
                    return;
                }
                // POST /api/Listing/CreateListing
                await api.api.listingCreateListing({
                    vendorId: user.id,
                    categoryId: formCategory,
                    title: formTitle,
                    price: Number(formPrice),
                    stockQuantity: Math.trunc(Number(formStock)),
                });
            } else {
                // PUT /api/Listing/UpdateListing (title, price and stock; category can't change)
                await api.api.listingUpdateListing({
                    listingId: modal.listing.listingId,
                    title: formTitle,
                    price: Number(formPrice),
                    stockQuantity: Math.trunc(Number(formStock)),
                });
            }
            setModal(null);
            await load(user.id);
        } catch (e: any) {
            setModalError(e.error?.detail ?? "Save failed");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!user || modal?.mode !== "edit") return;
        // first click arms the button, second click really deletes
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            return;
        }
        setSaving(true);
        try {
            // DELETE /api/Listing/DeleteListing
            await api.api.listingDeleteListing({ listingId: modal.listing.listingId });
            setModal(null);
            setConfirmingDelete(false);
            await load(user.id);
        } catch (e: any) {
            setModalError(e.error?.detail ?? "Delete failed");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!user) {
        return (
            <div>
                <h2>My shop</h2>
                <p className="info">Log in first to see your shop.</p>
                <button className="btn btn-primary" onClick={() => navigate("/login")}>
                    Log in
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>My shop</h2>
            <p>
                <button className="btn btn-primary" onClick={openCreate}>
                    New listing
                </button>
            </p>

            {error && <p className="error">{error}</p>}

            {listings.length === 0 ? (
                <p className="info">You have no listings yet.</p>
            ) : (
                <div className="grid">
                    {listings.map((l) => (
                        <article
                            key={l.listingId}
                            className="card"
                            role="button"
                            tabIndex={0}
                            onClick={() => openEdit(l)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    openEdit(l);
                                }
                            }}
                        >
                            <h3 className="card-title">{l.title}</h3>
                            <p className="price">${Number(l.price ?? 0).toFixed(2)}</p>
                            <p className="meta">Stock: {l.stockQuantity}</p>
                            <p className="meta">{l.categoryName}</p>
                        </article>
                    ))}
                </div>
            )}

            {modal && (
                <Modal
                    label={modal.mode === "create" ? "New listing" : (modal.listing.title ?? "Edit listing")}
                    onClose={() => setModal(null)}
                >
                    <h3>{modal.mode === "create" ? "New listing" : "Edit listing"}</h3>

                    <label className="field">
                        Title
                        <input
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="What are you selling?"
                        />
                    </label>
                    <label className="field">
                        Price ($)
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                        />
                    </label>
                    <label className="field">
                        Stock
                        <input
                            type="number"
                            min={0}
                            step={1}
                            value={formStock}
                            onChange={(e) => setFormStock(e.target.value)}
                        />
                    </label>
                    {modal.mode === "create" && (
                        <label className="field">
                            Category
                            <select
                                value={formCategory}
                                onChange={(e) =>
                                    setFormCategory(e.target.value === "" ? "" : Number(e.target.value))
                                }
                            >
                                <option value="">Pick a category</option>
                                {categories.map((c) => (
                                    <option key={c.categoryId} value={c.categoryId}>
                                        {c.categoryName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {modalError && <p className="error">{modalError}</p>}

                    <div className="buy-row">
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving…" : "Save"}
                        </button>
                        {modal.mode === "edit" && (
                            <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                                {confirmingDelete ? "Really delete?" : "Delete"}
                            </button>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}
