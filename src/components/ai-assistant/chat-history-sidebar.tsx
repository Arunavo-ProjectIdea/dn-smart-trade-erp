"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Plus, Search, MessageSquare, Trash2, Clock, Sparkles } from "lucide-react"

interface ChatHistorySidebarProps {
  onSelectChat?: (title: string) => void
  onNewChat?: () => void
  currentChatTitle?: string
}

export function ChatHistorySidebar({ onSelectChat, onNewChat, currentChatTitle }: ChatHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const historyGroups = [
    {
      group: "Today",
      chats: [
        { id: "1", title: "HS Code 8703.80.00 Classification", time: "10:42 AM", category: "Tariff" },
        { id: "2", title: "Predict clearance time for BOE-491", time: "09:15 AM", category: "BOE Audit" },
      ]
    },
    {
      group: "Yesterday",
      chats: [
        { id: "3", title: "Summarize yesterday's export shipments", time: "Jul 20", category: "Analytics" },
        { id: "4", title: "Find documents missing for Apex Trading", time: "Jul 20", category: "Docs" },
      ]
    },
    {
      group: "Previous 7 Days",
      chats: [
        { id: "5", title: "EU Duty Tariff updates for steel", time: "Jul 18", category: "Compliance" },
        { id: "6", title: "China import customs delay analysis", time: "Jul 15", category: "Logistics" },
      ]
    }
  ]

  const filteredGroups = historyGroups.map(g => ({
    ...g,
    chats: g.chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(g => g.chats.length > 0)

  return (
    <Card className="flex flex-col h-full bg-card border border-border/80 shadow-xs rounded-2xl overflow-hidden">
      {/* Header & New Chat Button */}
      <CardHeader className="p-4 pb-3 border-b border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <History className="size-4 stroke-[2.5]" />
            </div>
            Chat History
          </CardTitle>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            6 Saved
          </span>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shadow-xs text-xs h-9 justify-start"
        >
          <Plus className="mr-2 size-4 stroke-[2.5]" />
          Start New Thread
        </Button>

        {/* Search Filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="h-8 pl-8 text-xs rounded-xl border-border/80 bg-background/50 focus-visible:ring-primary/20"
          />
        </div>
      </CardHeader>

      {/* History List */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full px-3 py-2">
          <div className="space-y-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-1">
                    <Clock className="size-3" />
                    {group.group}
                  </span>

                  <div className="space-y-1 pt-1">
                    {group.chats.map((chat) => {
                      const isActive = currentChatTitle === chat.title
                      return (
                        <div
                          key={chat.id}
                          className="group relative flex items-center"
                        >
                          <button
                            onClick={() => onSelectChat?.(chat.title)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between gap-2 border ${
                              isActive
                                ? "bg-primary/10 text-primary border-primary/30 font-semibold shadow-xs"
                                : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <MessageSquare className={`size-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                              <span className="truncate">{chat.title}</span>
                            </div>

                            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-normal bg-background/80 border border-border/40 shrink-0">
                              {chat.category}
                            </span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No matching chat history found.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Quick Footer Badge */}
      <div className="p-3 border-t border-border/60 bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-primary" />
          Auto-saved to cloud
        </span>
        <span className="text-xs font-mono font-bold text-foreground">GPT-4o</span>
      </div>
    </Card>
  )
}
