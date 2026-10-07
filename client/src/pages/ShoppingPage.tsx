import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { api } from "../apiClient";
import type { ListingDto, UserDto } from "../api/Api";
import type { ShopSearch } from "../App";
import { Modal } from "../components/Modal";
import { CategoryIcon } from "../components/CategoryIcon";
import { Empty } from "../components/Empty";
import { getSavedUser } from "../user";
import { money } from "../money";

// what the product modal shows after the Buy button is pressed
type BuyResult = {
    kind: "ok" | "discount" | "raid" | "error";
    message: string;
    total: number | null;
};

// the market: every active listing, filtered by the search in the header, and the buy window
export function ShoppingPage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [featured, setFeatured] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // product modal: which listing is open, quantity, order in flight, order result
    const [selected, setSelected] = useState<ListingDto | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [placing, setPlacing] = useState(false);
    const [result, setResult] = useState<BuyResult | null>(null);

    const user = getSavedUser();
    const navigate = useNavigate();
    // the search text and the category from the header, App gives them through the <Outlet />
    const { query, category } = useOutletContext<ShopSearch>();

    async function load() {
        try {
            setError("");
            // both calls at once: active listings and featured vendors
            const [l, f] = await Promise.all([
                api.api.listingGetActiveListings(),
                api.api.userGetTopVendors(),
            ]);
            setListings(l);
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

    // null = "All categories", otherwise only listings with this categoryId show;
    // the search text filters by title; both filters apply at the same time.
    // featured sellers' listings always sort first (sort is stable, so the rest keeps backend order)
    const q = query.trim().toLowerCase();
    const visible = listings
        .filter((l) => category === null || l.categoryId === category)
        .filter((l) => q === "" || (l.title ?? "").toLowerCase().includes(q))
        .sort((a, b) => Number(isFeatured(b)) - Number(isFeatured(a)));

    function openModal(l: ListingDto) {
        setSelected(l);
        setQuantity(1);
        setResult(null);
    }

    function closeModal() {
        setSelected(null);
        setResult(null);
        load(); // reload everything: new stock, maybe new featured vendors
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
            <div className="page-head">
                <h2>Shopping</h2>
            </div>

            {error && <p className="error">{error}</p>}

            {/* nothing for sale at all, or the search in the header hides everything */}
            {listings.length === 0 ? (
                <Empty text="Nothing for sale right now." />
            ) : visible.length === 0 ? (
                <Empty text="Nothing matches your search." />
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

                        {/* the discount rule, as a small hint under the Buy button */}
                        {result === null && (
                            <p className="tip">
                                <span className="tip-icon" aria-hidden="true">i</span>
                                Order more than 10 times from the same seller and you get 20% off.
                            </p>
                        )}
                </Modal>
            )}
        </div>
    );
}
