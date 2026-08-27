import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { useDebouncedInput } from "@/hooks/use-debounced-input"

interface PatientSearchBarProps {
  searchInput: ReturnType<typeof useDebouncedInput>
  hasActiveFilters: boolean
  filtersOpen: boolean
  onToggleFilters: () => void
}

export function PatientSearchBar({ searchInput, hasActiveFilters, filtersOpen, onToggleFilters }: PatientSearchBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, responsável ou avaliador..."
          value={searchInput.value}
          onChange={(event) => searchInput.onChange(event.target.value)}
          className="pl-9"
        />
        {searchInput.value && (
          <button
            onClick={searchInput.clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFilters}
        className={`cursor-pointer ${hasActiveFilters ? "border-primary-500 text-primary-600" : ""}`}
        aria-pressed={filtersOpen}
      >
        <SlidersHorizontal size={14} />
        Filtros
        {hasActiveFilters && (
          <span className="ml-1 rounded-full bg-primary-600 px-1.5 text-[10px] text-white">!</span>
        )}
      </Button>
    </div>
  )
}
