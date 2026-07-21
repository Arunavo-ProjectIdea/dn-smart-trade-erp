"use client"

import { Card } from "@/components/ui/card"
import { Zap, Search, FileText, ShieldAlert, Sparkles, ArrowRight, Package } from "lucide-react"

interface PromptSuggestionsProps {
  prompts: string[]
  onSelectPrompt: (prompt: string) => void
}

export function PromptSuggestions({ prompts, onSelectPrompt }: PromptSuggestionsProps) {
  const categories = [
    { icon: Zap, label: "Clearance ETA", style: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { icon: Search, label: "Tariff Lookup", style: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
    { icon: FileText, label: "Logistics Brief", style: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { icon: ShieldAlert, label: "Audit Check", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ]

  return (
    <div className="space-y-3 my-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="size-3 text-primary" />
          Suggested Trade Prompts
        </span>
        <span className="text-[11px] text-muted-foreground">Click card to execute prompt</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => {
          const cat = categories[index % categories.length]
          const IconComp = cat.icon

          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt)}
              className="text-left w-full group focus:outline-none"
            >
              <Card className="p-3.5 border border-border/80 bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs transition-all duration-300 rounded-xl space-y-2 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${cat.style}`}>
                    <IconComp className="size-3" />
                    {cat.label}
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200 transform group-hover:translate-x-0.5" />
                </div>

                <p className="text-xs font-medium text-foreground/90 group-hover:text-foreground line-clamp-2">
                  "{prompt}"
                </p>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
