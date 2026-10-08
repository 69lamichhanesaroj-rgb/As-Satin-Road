import type { ReactNode } from "react";
import devil from "../devil.svg";

// The card in the middle of a page when there is nothing to show:
// no listings, no orders, log in first...
// A button (like "Log in") can go inside as children.
export function Empty({ text, children }: { text: string; children?: ReactNode }) {
    return (
        <div className="empty">
            <img className="empty-devil" src={devil} alt="" width={44} height={44} />
            <p>{text}</p>
            {children}
        </div>
    );
}
