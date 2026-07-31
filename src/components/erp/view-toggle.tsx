import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faList, faGrip } from "@fortawesome/free-solid-svg-icons"

interface ViewToggleProps {
  viewMode: "table" | "grid"
  onViewModeChange: (mode: "table" | "grid") => void
}

/**
 * Shared Table/Grid view toggle component.
 * Always positioned right-aligned, below the page divider, above the content area.
 * Usage: place in a `<div className="flex justify-end -mt-4 mb-2">` wrapper.
 */
export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-border p-1 bg-muted/30">
      <Button
        variant="ghost"
        size="sm"
        className={viewMode === "table" ? "bg-background shadow-sm" : "hover:bg-transparent text-muted-foreground"}
        onClick={() => onViewModeChange("table")}
        title="Table view"
        aria-pressed={viewMode === "table"}
      >
        <FontAwesomeIcon icon={faList} className="h-4 w-4 mr-2" />
        Table
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={viewMode === "grid" ? "bg-background shadow-sm" : "hover:bg-transparent text-muted-foreground"}
        onClick={() => onViewModeChange("grid")}
        title="Grid view"
        aria-pressed={viewMode === "grid"}
      >
        <FontAwesomeIcon icon={faGrip} className="h-4 w-4 mr-2" />
        Grid
      </Button>
    </div>
  )
}
