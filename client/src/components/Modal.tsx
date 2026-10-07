import { useEffect, type ReactNode } from "react";

// Generic modal shell: dimmed backdrop, close button, Escape to close.
// The actual content goes inside as children.
export function Modal({
    label,
    onClose,
    children,
}: {
    label: string;
    onClose: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label={label}
                onClick={(e) => e.stopPropagation()}
            >
                {/* the X is two drawn lines, a text ✕ never sits exactly in the middle of the circle */}
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}
