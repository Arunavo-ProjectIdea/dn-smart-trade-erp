"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Mic, Send, Sparkles, Command, CornerDownLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ChatInputAreaProps {
  query: string
  setQuery: (query: string) => void
  onSend: (e?: React.FormEvent) => void
  isThinking: boolean
}

export function ChatInputArea({ query, setQuery, onSend, isThinking }: ChatInputAreaProps) {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)

  const handleMicClick = () => {
    setIsRecording(!isRecording)
    toast({
      title: isRecording ? "Microphone Stopped" : "Listening...",
      description: isRecording ? "Voice input processed." : "Speak your query regarding HS codes or BOE filing.",
    })
  }

  const handleAttachment = () => {
    toast({
      title: "Document Attachment",
      description: "Select BOE document or Commercial Invoice to upload for AI extraction.",
    })
  }

  return (
    <div className="p-4 bg-card border-t border-border/80 space-y-3">
      <div className="max-w-4xl mx-auto w-full space-y-2">
        {/* Floating Input Container */}
        <form
          onSubmit={onSend}
          className="relative flex flex-col w-full rounded-2xl border border-border/80 bg-background/80 backdrop-blur-xs shadow-xs focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 overflow-hidden"
        >
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Assistant about HS code classification, BOE clearance delays, or trade metrics..."
            className="w-full min-h-[64px] max-h-36 resize-none bg-transparent p-4 text-sm focus:outline-none border-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
          />

          {/* Action Toolbar Inside Input Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-border/40 bg-muted/20">
            <div className="flex items-center gap-1.5">
              {/* Attachment Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleAttachment}
                className="size-8 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Attach document or invoice"
              >
                <Paperclip className="size-4" />
              </Button>

              {/* Mic Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleMicClick}
                className={`size-8 rounded-xl hover:bg-muted ${isRecording ? "text-rose-500 bg-rose-500/10 animate-pulse" : "text-muted-foreground hover:text-foreground"}`}
                title="Voice input"
              >
                <Mic className="size-4" />
              </Button>

              {/* Model Tag */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-3" />
                GPT-4o Enterprise
              </span>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isThinking}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 font-semibold shadow-xs transition-all duration-200"
            >
              <span className="mr-1.5 hidden sm:inline">Send</span>
              <CornerDownLeft className="size-3.5 stroke-[2.5]" />
            </Button>
          </div>
        </form>

        {/* Footer Hint */}
        <div className="flex justify-between items-center px-1 text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
          <span>AI outputs are verified against customs tariff manuals</span>
          <span className="flex items-center gap-1">
            <Command className="size-3" /> + Enter to send
          </span>
        </div>
      </div>
    </div>
  )
}
