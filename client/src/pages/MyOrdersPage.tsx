import { useEffect, useState } from "react";
import { api } from "../apiClient";
import type { BuyerOrderDto } from "../api/Api";
import { getSavedUser } from "../user";

export function MyOrdersPage() {
    const [orders, setOrders] = useState<BuyerOrderDto[]>([]);
    const [error, setError] = useState("");

    const user = getSavedUser();

    // load my orders once when the page opens
    // hooks always have to run, so this comes before the "log in first" check below
    useEffect(() => {
        if (!user) return;
        api.api.orderGetOrdersByBuyer({ buyerId: user.id })
            .then(r => setOrders(r))
            .catch((e: any) => setError(e.error?.detail ?? "Could not load orders"));
    }, []);

    if (!user) {
        return <p>log in first</p>;
    }

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
