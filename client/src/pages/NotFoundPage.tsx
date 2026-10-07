import { useNavigate } from "react-router";
import { Empty } from "../components/Empty";

// shown for every address that is not one of our pages
export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="page-head">
                <h2>This road leads nowhere</h2>
            </div>
            <Empty text="The page you looked for does not exist, or the FBI took it.">
                <button className="btn btn-primary" onClick={() => navigate("/shopping")}>
                    Back to the market
                </button>
            </Empty>
        </div>
    );
}
