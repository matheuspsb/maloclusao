import type { SortDir, SortKey } from "@/types/sortkey.types";

export function SortIndicator({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return null
  return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
}