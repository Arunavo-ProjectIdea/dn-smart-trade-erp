"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw, Bookmark, Share2, ShieldCheck, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  role: string
  content: string
  sources?: string[]
  confidence?: number
}

interface ChatMessageItemProps {
  message: Message
  index: number
  onRegenerate?: () => void
}

export function ChatMessageItem({ message, index, onRegenerate }: ChatMessageItemProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const [bookmarked, setBookmarked] = useState(false)

  const isUser = message.role === "user"

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast({ title: "Copied to clipboard", description: "Response text copied successfully." })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    toast({
      title: bookmarked ? "Removed from Bookmarks" : "Saved to Bookmarks",
      description: bookmarked ? "Insight removed." : "Added to your saved AI trade insights.",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3.5 sm:gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar Box */}
      <div
        className={`size-9 sm:size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 border border-primary/20 text-primary"
        }`}
      >
        {isUser ? "US" : <Bot className="size-5" />}
      </div>

      {/* Message Content Container */}
      <div className={`space-y-2 max-w-[88%] sm:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Author Label & Confidence Badge */}
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="font-semibold text-foreground text-[11px]">
            {isUser ? "You" : "DN Smart Trade AI"}
          </span>
          {!isUser && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="size-3" />
              98.4% Confidence
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-xs font-medium shadow-xs"
              : "bg-card border border-border/80 text-foreground rounded-tl-xs shadow-xs space-y-3"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Citations / Sources Badge inside Assistant Message */}
          {!isUser && (
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <FileText className="size-3 text-primary" />
                Verified Citations:
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/40">
                HS Tariff Manual 2026 (§8703.80)
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/40">
                Customs Clearance Database
              </span>
            </div>
          )}
        </div>

        {/* Action Toolbar for Assistant Messages */}
        {!isUser && (
          <div className="flex items-center gap-1 pt-1 text-muted-foreground">
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="size-7 rounded-lg hover:text-foreground hover:bg-muted"
              title="Copy message"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            </Button>

            {/* Regenerate Button */}
            {onRegenerate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRegenerate}
                className="size-7 rounded-lg hover:text-foreground hover:bg-muted"
                title="Regenerate response"
              >
                <RefreshCw className="size-3.5" />
              </Button>
            )}

            {/* Thumbs Up */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(liked === true ? null : true)}
              className={`size-7 rounded-lg hover:bg-muted ${liked === true ? "text-emerald-500" : ""}`}
              title="Helpful response"
            >
              <ThumbsUp className="size-3.5" />
            </Button>

            {/* Thumbs Down */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(liked === false ? null : false)}
              className={`size-7 rounded-lg hover:bg-muted ${liked === false ? "text-rose-500" : ""}`}
              title="Not helpful"
            >
              <ThumbsDown className="size-3.5" />
            </Button>

            {/* Bookmark */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={`size-7 rounded-lg hover:bg-muted ${bookmarked ? "text-primary" : ""}`}
              title="Save insight"
            >
              <Bookmark className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
