// a price as text with 2 decimals and a comma for thousands, like 9999 -> "$9,999.00"
export function money(amount: number | null | undefined) {
    return "$" + (amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
