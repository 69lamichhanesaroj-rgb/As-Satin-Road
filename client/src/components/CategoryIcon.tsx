// a small app style icon for a category: a colored glass tile with the first letter in white
// the color comes from the category id, so the same category always gets the same color
const colors = [
    ["#F2C462", "#A8701F"], // gold
    ["#D9434B", "#7A1219"], // red
    ["#3FBF8A", "#0E6B47"], // green
    ["#5B8DEF", "#1E3F99"], // blue
    ["#A374F0", "#5B2BB0"], // purple
    ["#E58A4E", "#8F3F14"], // copper
];

export function CategoryIcon({ id, name, size = 48 }: { id: number; name: string; size?: number }) {
    const index = id % colors.length;
    const [top, bottom] = colors[index]!;
    // same id for the same color, so two icons with the same color can share it
    const gradientId = `cat-color-${index}`;

    return (
        <svg className="cat-icon" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
            <defs>
                <linearGradient id={gradientId} x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor={top} />
                    <stop offset="1" stopColor={bottom} />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="60" height="60" rx="13.5" fill={`url(#${gradientId})`} />
            {/* the soft shine on the top half, like an app icon */}
            <path
                d="M2 15.5A13.5 13.5 0 0 1 15.5 2h33A13.5 13.5 0 0 1 62 15.5V30C52 36 42 39 32 39S12 36 2 30Z"
                fill="#fff"
                opacity="0.12"
            />
            <text x="32" y="43" textAnchor="middle" fontSize="30" fontWeight="600" fill="#fff">
                {name.charAt(0).toUpperCase()}
            </text>
            <rect x="2.9" y="2.9" width="58.2" height="58.2" rx="12.7" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.6" />
        </svg>
    );
}
