import { useNavigate } from "react-router";

// shown for every address that is not one of our pages
export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="panel">
            <p className="eyebrow">404</p>
            <h2>This road leads nowhere</h2>
            <p className="subtitle">The page you looked for does not exist, or the FBI took it.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
                Back to the market
            </button>
        </div>
    );
}
