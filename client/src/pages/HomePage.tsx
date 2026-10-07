import { useNavigate } from "react-router";
import logoSr from "../logo-sr.svg";

// the first page: one big banner that fills the screen, the listings are on the Shopping page
export function HomePage() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-text">
                <h2 className="hero-title">
                    The finest goods.<br />
                    <em className="sheen">No questions asked.</em>
                </h2>
                <div className="hero-actions">
                    <button className="btn btn-primary btn-lg" onClick={() => navigate("/shopping")}>
                        Start shopping
                    </button>
                    <button className="btn btn-lg" onClick={() => navigate("/shop")}>
                        Open your shop
                    </button>
                </div>
            </div>
            <img className="hero-logo" src={logoSr} alt="" />
        </section>
    );
}
