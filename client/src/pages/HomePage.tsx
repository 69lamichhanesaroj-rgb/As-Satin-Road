import { useNavigate } from "react-router";
import logoSr from "../logo-sr.svg";
import devil from "../devil.svg";

// the first page: one big banner that fills the screen, the listings are on the Shopping page
export function HomePage() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-text">
                <h2 className="hero-title">
                    The finest goods.<br />
                    {/* the gold devil is the dot at the end. "asked" and the devil sit in one
                        no-break span, so the devil never ends up alone on the next line */}
                    <em className="sheen">
                        No questions <span className="no-break">asked<img className="devil" src={devil} alt="" /></span>
                    </em>
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
            {/* width/height reserve the space before the svg loads (kills a layout shift),
                fetchPriority because this is the LCP image. 250 wide = 206 tall (svg viewBox ratio) */}
            <img className="hero-logo" src={logoSr} alt="" width={250} height={206} fetchPriority="high" />
        </section>
    );
}
