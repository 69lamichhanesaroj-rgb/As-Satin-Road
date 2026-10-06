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
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}
