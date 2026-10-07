import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apiClient";
import type { BuyerOrderDto } from "../api/Api";
import { getSavedUser } from "../user";
import { money } from "../money";
import { Empty } from "../components/Empty";

export function MyOrdersPage() {
    const [orders, setOrders] = useState<BuyerOrderDto[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const user = getSavedUser();

    // load my orders once when the page opens
    // hooks always have to run, so this comes before the "log in first" check below
    useEffect(() => {
        if (!user) return;
        api.api.orderGetOrdersByBuyer({ buyerId: user.id })
            .then(r => setOrders(r))
            .catch((e: any) => setError(e.error?.detail ?? "Could not load orders"));
    }, []);

    // the title bar, the same in every case below
    const head = (
        <div className="page-head">
            <h2>My orders</h2>
        </div>
    );

    if (!user) {
        return (
            <div>
                {head}
                <Empty text="Log in first to see your orders.">
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>Log in</button>
                </Empty>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                {head}
                <p className="error">{error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div>
                {head}
                <Empty text="No orders yet.">
                    <button className="btn btn-primary" onClick={() => navigate("/shopping")}>Start shopping</button>
                </Empty>
            </div>
        );
    }

    // the numbers for the small summary above the table
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);
    const discounted = orders.filter(o => o.isDiscountApplied).length;

    return (
        <div>
            {head}
            <div className="chips">
                <span className="chip"><b>{orders.length}</b> orders</span>
                <span className="chip"><b>{money(totalSpent)}</b> spent</span>
                <span className="chip"><b>{discounted}</b> with 20% off</span>
            </div>
            <div className="panel table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.orderId}>
                                <td>{new Date(o.orderDate ?? "").toLocaleDateString()}</td>
                                <td>{o.listingTitle}</td>
                                <td>{o.quantity}</td>
                                <td className="price">{money(o.totalPrice)}</td>
                                <td>{o.isDiscountApplied && <span className="badge">20% off</span>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
