// a small app style icon for a category: a gold tile with the first letter,
// the same gold as the buttons, so every category looks the same
export function CategoryIcon({ name, size = 48 }: { name: string; size?: number }) {
    return (
        <svg className="cat-icon" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
            <defs>
                <linearGradient id="cat-gold" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#F7D98F" />
                    <stop offset="0.6" stopColor="#E6B04A" />
                    <stop offset="1" stopColor="#B8822C" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="60" height="60" rx="13.5" fill="url(#cat-gold)" />
            {/* the soft shine on the top half, like an app icon */}
            <path
                d="M2 15.5A13.5 13.5 0 0 1 15.5 2h33A13.5 13.5 0 0 1 62 15.5V30C52 36 42 39 32 39S12 36 2 30Z"
                fill="#fff"
                opacity="0.16"
            />
            <text x="32" y="43" textAnchor="middle" fontSize="30" fontWeight="600" fill="#1C1408">
                {name.charAt(0).toUpperCase()}
            </text>
            <rect x="2.9" y="2.9" width="58.2" height="58.2" rx="12.7" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.6" />
        </svg>
    );
}
