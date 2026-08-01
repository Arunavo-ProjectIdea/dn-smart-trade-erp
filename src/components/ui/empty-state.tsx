"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface EmptyStateProps {
  icon: IconDefinition
  title: string
  description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-dashed rounded-lg">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <FontAwesomeIcon icon={icon} className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}
