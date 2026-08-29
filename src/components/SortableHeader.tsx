import type { SortKey } from "../types";

const SortableHeader = (
    {
        keyName,
        label,
        sortBy,
        alignCenter = false,
        onSort,
        children
    }: {
        children?: React.ReactNode
        keyName: SortKey;
        label?: string;
        sortBy: SortKey;
        alignCenter?: boolean;
        onSort: (key: SortKey) => void;
    }) => (
    <th
        className={`px-4 py-3 cursor-pointer select-none group hover:bg-gray-600 transition ${alignCenter ? "text-center" : "text-left"}`}
        onClick={() => onSort(keyName)}
        title={`Trier par ${label || keyName}`}
    >
        <div className={`flex items-center gap-2 ${alignCenter ? "justify-center" : ""}`}>
            {children || label}
            <span className={`text-[10px] ${sortBy === keyName ? "text-purple-400 opacity-100" : "text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"}`}>
                ▼
            </span>
        </div>
    </th>
);

export default SortableHeader;