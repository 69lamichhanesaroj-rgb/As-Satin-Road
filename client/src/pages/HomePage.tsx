import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";
import type { Category, ListingDto, UserDto } from "../api/Api";
import { Modal } from "../components/Modal";
import { CategoryIcon } from "../components/CategoryIcon";
import { getSavedUser } from "../user";
import { money } from "../money";
import logoSr from "../logo-sr.svg";

// what the product modal shows after the Buy button is pressed
type BuyResult = {
    kind: "ok" | "discount" | "raid" | "error";
    message: string;
    total: number | null;
};

export function HomePage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [featured, setFeatured] = useState<UserDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // product modal: which listing is open, quantity, order in flight, order result
    const [selected, setSelected] = useState<ListingDto | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [placing, setPlacing] = useState(false);
    const [result, setResult] = useState<BuyResult | null>(null);

    const user = getSavedUser();
    const navigate = useNavigate();

    async function load() {
        try {
            setError("");
            // all three calls at once: active listings, categories, featured vendors
            const [l, c, f] = await Promise.all([
                api.api.listingGetActiveListings(),
                api.api.categoryGetCategories(),
                api.api.userGetTopVendors(),
            ]);
            setListings(l);
            setCategories(c);
            setFeatured(f);
        } catch (e: any) {
            // the backend sends the reason in "detail", the generated client puts it in e.error
            setError(e.error?.detail ?? "Could not load listings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []); // [] = run once when the page opens

    // match listings to featured vendors by id (both come from the backend)
    const featuredIds = new Set(featured.map((u) => u.id));
    const isFeatured = (l: ListingDto) => l.vendorId != null && featuredIds.has(l.vendorId);

    // how many listings each category has, for the "(n)" counts
    function countFor(categoryId: number | null) {
        return categoryId === null
            ? listings.length
            : listings.filter((l) => l.categoryId === categoryId).length;
    }

    function labelFor(categoryId: number | null) {
        if (categoryId === null) {
            return `All categories (${countFor(null)})`;
        }
        const name = categories.find((c) => c.categoryId === categoryId)?.categoryName ?? "Category";
        return `${name} (${countFor(categoryId)})`;
    }

    // null = "All categories", otherwise only listings with this categoryId show;
    // the search box filters by title; both filters apply at the same time.
    // featured sellers' listings always sort first (sort is stable, so the rest keeps backend order)
    const q = query.trim().toLowerCase();
    const visible = listings
        .filter((l) => selectedCategory === null || l.categoryId === selectedCategory)
        .filter((l) => q === "" || (l.title ?? "").toLowerCase().includes(q))
        .sort((a, b) => Number(isFeatured(b)) - Number(isFeatured(a)));

    function pick(categoryId: number | null) {
        setSelectedCategory(categoryId);
        setMenuOpen(false);
    }

    function openModal(l: ListingDto) {
        setSelected(l);
        setQuantity(1);
        setResult(null);
    }

    function closeModal() {
        setSelected(null);
        setResult(null);
        load(); // reload everything: new stock, new counts, maybe new featured vendors
    }

    async function handleBuy() {
        if (!user || !selected) return;
        setPlacing(true);
        try {
            // POST /api/Order -> normal order, 20% discount, or FBI raid
            const r = await api.api.orderPlaceOrder({
                buyerId: user.id,
                listingId: selected.listingId,
                quantity,
            });
            if (r.wasFbiRaid) {
                setResult({ kind: "raid", message: r.message ?? "FBI raid!", total: null });
            } else if (r.order?.isDiscountApplied) {
                setResult({
                    kind: "discount",
                    message: r.message ?? "Discount applied!",
                    total: r.order?.totalPrice ?? null,
                });
            } else {
                setResult({
                    kind: "ok",
                    message: r.message ?? "Order placed!",
                    total: r.order?.totalPrice ?? null,
                });
            }
        } catch (e: any) {
            setResult({ kind: "error", message: e.error?.detail ?? "Order failed", total: null });
        } finally {
            setPlacing(false);
        }
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <section className="hero">
                <div className="hero-text">
                    <p className="hero-badge">Open 24/7 · 1% FBI risk</p>
                    <h2 className="hero-title">
                        The finest goods.<br />
                        <em className="sheen">No questions asked.</em>
                    </h2>
                    <p className="hero-sub">
                        Buy from sellers you can almost trust. Order more than 10 times from the same seller
                        and you get 20% off.
                    </p>
                    <div className="hero-actions">
                        {/* scrolls down to the listings */}
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            Browse listings
                        </button>
                        <button className="btn btn-lg" onClick={() => navigate("/shop")}>
                            Open your shop
                        </button>
                    </div>
                    <dl className="hero-stats">
                        <div>
                            <dt>Listings</dt>
                            <dd>{listings.length}</dd>
                        </div>
                        <div>
                            <dt>Categories</dt>
                            <dd>{categories.length}</dd>
                        </div>
                        <div>
                            <dt>Featured sellers</dt>
                            <dd>{featured.length}</dd>
                        </div>
                    </dl>
                </div>
                <img className="hero-logo" src={logoSr} alt="" />
            </section>

            <div className="layout">
                <aside className="sidebar">
                    <h3 className="side-title">Shop by Category</h3>
                    <ul className="side-list">
                        <li className={selectedCategory === null ? "side-item active" : "side-item"}>
                            <button onClick={() => pick(null)}>
                                <span>All</span>
                                <span className="count">{countFor(null)}</span>
                            </button>
                        </li>
                        {categories.map((c) => (
                            <li
                                key={c.categoryId}
                                className={selectedCategory === c.categoryId ? "side-item active" : "side-item"}
                            >
                                <button onClick={() => pick(c.categoryId ?? null)}>
                                    <span>{c.categoryName}</span>
                                    <span className="count">{countFor(c.categoryId ?? null)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className="content" id="listings">
                    <form className="search" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="search">Search</label>
                        <input
                            id="search"
                            placeholder="Search listings..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                            Go
                        </button>
                    </form>

                    <div className="menu">
                        <button
                            className="menu-btn"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((o) => !o)}
                        >
                            <span>{labelFor(selectedCategory)}</span>
                            <span aria-hidden="true">{menuOpen ? "▴" : "▾"}</span>
                        </button>
                        {menuOpen && (
                            <ul className="menu-list">
                                <li className={selectedCategory === null ? "active" : undefined}>
                                    <button onClick={() => pick(null)}>
                                        <span>All</span>
                                        <span className="count">{countFor(null)}</span>
                                    </button>
                                </li>
                                {categories.map((c) => (
                                    <li
                                        key={c.categoryId}
                                        className={selectedCategory === c.categoryId ? "active" : undefined}
                                    >
                                        <button onClick={() => pick(c.categoryId ?? null)}>
                                            <span>{c.categoryName}</span>
                                            <span className="count">{countFor(c.categoryId ?? null)}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {error && <p className="error">{error}</p>}

                    {visible.length === 0 ? (
                        <p className="info">No listings.</p>
                    ) : (
                        <div className="grid">
                            {visible.map((l) => (
                                <article
                                    key={l.listingId}
                                    className="card"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openModal(l)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            openModal(l);
                                        }
                                    }}
                                >
                                    {/* the category's icon instead of a picture */}
                                    <div className="card-top">
                                        {isFeatured(l) && <span className="badge">★ Featured seller</span>}
                                        <CategoryIcon id={l.categoryId ?? 0} name={l.categoryName ?? "?"} size={64} />
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{l.title}</h3>
                                        <p className="meta">
                                            {l.categoryName} · {l.vendorName}
                                        </p>
                                    </div>
                                    <div className="card-foot">
                                        <span className="price">{money(l.price)}</span>
                                        <span className={l.stockQuantity === 0 ? "stock out" : "stock"}>
                                            {l.stockQuantity} in stock
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {selected && (
                <Modal label={selected.title ?? "Product"} onClose={closeModal}>
                    <div className="modal-icon">
                        <CategoryIcon id={selected.categoryId ?? 0} name={selected.categoryName ?? "?"} size={56} />
                    </div>
                    {isFeatured(selected) && <span className="badge">★ Featured seller</span>}
                        <h3 className="card-title">{selected.title}</h3>
                        <p className="price">{money(selected.price)}</p>
                        <p className="meta">{selected.stockQuantity} in stock</p>
                        <p className="meta">
                            {selected.categoryName} · Seller: {selected.vendorName}
                        </p>

                        {user && selected.vendorId === user.id && (
                            <p className="notice">This is your listing.</p>
                        )}

                        {result === null ? (
                            user ? (
                                <div className="buy-row">
                                    <label htmlFor="qty">Quantity</label>
                                    <input
                                        id="qty"
                                        className="qty"
                                        type="number"
                                        min={1}
                                        max={selected.stockQuantity ?? undefined}
                                        value={quantity}
                                        onChange={(e) => {
                                            const n = Number(e.target.value);
                                            setQuantity(Number.isNaN(n) ? 1 : Math.max(1, n));
                                        }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleBuy}
                                        disabled={placing}
                                    >
                                        {placing ? "Placing order…" : "Buy"}
                                    </button>
                                </div>
                            ) : (
                                <div className="buy-row">
                                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                                        Log in to buy
                                    </button>
                                </div>
                            )
                        ) : (
                            <div>
                                <p
                                    className={
                                        result.kind === "ok"
                                            ? "info"
                                            : result.kind === "discount"
                                              ? "notice"
                                              : "error"
                                    }
                                >
                                    {result.message}
                                    {result.total != null && (
                                        <> Total: {money(result.total)}</>
                                    )}
                                </p>
                                <div className="buy-row">
                                    <button className="btn btn-primary" onClick={closeModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                </Modal>
            )}
        </div>
    );
}
