import { useEffect, useState } from "react";
import { api } from "../apiClient";

type BuyerOrder = {
    orderId?: string;
    listingId?: string;
    listingTitle?: string;
    quantity?: number;
    totalPrice?: number;
    isDiscountApplied?: boolean;
    orderDate?: string;
};

function getSavedUser(): { id: string; username: string; role: string } | null {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function MyOrdersPage() {
    const [orders, setOrders] = useState<BuyerOrder[]>([]);
    const [error, setError] = useState("");

    const user = getSavedUser();
    if (!user) {
        return <p>log in first</p>;
    }

    return <MyOrdersInner buyerId={user.id} orders={orders} setOrders={setOrders} error={error} setError={setError} />;
}

function MyOrdersInner({ buyerId, orders, setOrders, error, setError }: {
    buyerId: string;
    orders: BuyerOrder[];
    setOrders: (o: BuyerOrder[]) => void;
    error: string;
    setError: (s: string) => void;
}) {
    useEffect(() => {
        // after `bun run generate:api`, hover orderGetOrdersByBuyer to fix exact shape, remove `as any`
        (api.api as any).orderGetOrdersByBuyer({ buyerId })
            .then((r: BuyerOrder[]) => setOrders(r ?? []))
            .catch((e: any) => setError(e?.detail ?? e?.Detail ?? e?.message ?? "Could not load orders"));
    }, [buyerId]);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (orders.length === 0) {
        return <p>no orders yet</p>;
    }

    return (
        <div>
            <h2>My orders</h2>
            <ul>
                {orders.map(o => (
                    <li key={o.orderId}>
                        {new Date(o.orderDate ?? "").toLocaleString()} — {o.listingTitle} × {o.quantity} — ${o.totalPrice}
                        {o.isDiscountApplied && <span> 20% off</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
