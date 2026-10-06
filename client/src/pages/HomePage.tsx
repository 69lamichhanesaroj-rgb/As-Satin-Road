import { useEffect, useState } from "react";
import { api } from "../apiClient";
import type { Category, ListingDto, UserDto } from "../api/Api";

/*
 * TODO #20 (Gabriela)
 * Buy a product, on each listing:
 * a number input for the quantity + a Buy button
 * -> the button calls api (OrderController.PlaceOrder) with the logged-in user's id, the listing id and the quantity
 * -> show the message that comes back: normal order, 20% discount, or FBI raid
 * -> load the listings again, so the new stock shows
 * If the user isn't logged in, show "log in to buy" instead of the button (#13 keeps the user).
 */

export function HomePage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [featured, setFeatured] = useState<UserDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
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

                <section className="content">
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
                                <article key={l.listingId} className="card">
                                    {isFeatured(l) && <span className="badge">★ Featured seller</span>}
                                    <h3 className="card-title">{l.title}</h3>
                                    <p className="price">${Number(l.price ?? 0).toFixed(2)}</p>
                                    <p className="meta">Stock: {l.stockQuantity}</p>
                                    <p className="meta">
                                        {l.categoryName} · Seller: {l.vendorName}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
