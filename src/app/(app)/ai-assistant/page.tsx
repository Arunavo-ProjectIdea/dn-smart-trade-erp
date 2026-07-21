"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Sparkles, Trash2, Layers, History, ShieldCheck, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PageHeader } from "@/components/erp/page-header"

import { ChatHistorySidebar } from "@/components/ai-assistant/chat-history-sidebar"
import { PromptSuggestions } from "@/components/ai-assistant/prompt-suggestions"
import { ChatMessageItem } from "@/components/ai-assistant/chat-message-item"
import { SourcesPanel } from "@/components/ai-assistant/sources-panel"
import { ChatInputArea } from "@/components/ai-assistant/chat-input-area"
import { useToast } from "@/components/ui/use-toast"

export default function AIAssistantPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [currentChatTitle, setCurrentChatTitle] = useState("HS Code 8703.80.00 Classification")
  const [showSources, setShowSources] = useState(true)

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI Trade Assistant. How can I help you today? You can ask me to predict shipment delays or classify a product for customs."
    }
  ])

  const suggestedPrompts = [
    "Predict clearance time for BOE-491",
    "What's the HS Code for electric vehicles?",
    "Summarize yesterday's export shipments",
    "Find documents missing for Apex Trading"
  ]

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    const newMessages = [...messages, { role: "user", content: query }]
    setMessages(newMessages)
    setQuery("")
    setIsThinking(true)

    // Simulate AI response
    setTimeout(() => {
      setIsThinking(false)
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Based on my analysis of your historical data and current customs regulations, I can confirm that electric vehicles typically fall under HS Code 8703.80.00. This covers 'Motor cars and other motor vehicles principally designed for the transport of persons... powered solely by an electric motor'."
        }
      ])
    }, 1500)
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat session cleared. How can I assist you with your trade operations today?"
      }
    ])
    toast({ title: "Session Cleared", description: "Chat history for this session has been reset." })
  }

  const handleSelectHistory = (title: string) => {
    setCurrentChatTitle(title)
    setMessages([
      {
        role: "assistant",
        content: `Loaded previous conversation thread: "${title}". How would you like to continue?`
      }
    ])
    toast({ title: "Thread Loaded", description: `Active topic set to: ${title}` })
  }

  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-7.5rem)] animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader 
          title="AI Trade Assistant" 
          description="Intelligent conversational interface for trade compliance, customs classification, and logistics predictions."
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSources(!showSources)}
            className="rounded-xl border-border/80 text-xs font-medium hidden md:inline-flex"
          >
            <Layers className="mr-1.5 size-3.5 text-primary" />
            {showSources ? "Hide Sources" : "Show Sources"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="rounded-xl border-border/80 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Main Multi-pane Dashboard Layout */}
      <div className="flex flex-1 gap-5 overflow-hidden">
        {/* Sidebar 1: Conversation History */}
        <div className="hidden lg:block w-72 shrink-0 h-full">
          <ChatHistorySidebar 
            onSelectChat={handleSelectHistory}
            onNewChat={handleClearChat}
            currentChatTitle={currentChatTitle}
          />
        </div>

        {/* Main Stage: Chat Window */}
        <Card className="flex flex-col flex-1 shadow-md border-border/80 bg-card overflow-hidden rounded-2xl">
          {/* Header Status Bar */}
          <CardHeader className="border-b border-border/60 bg-muted/20 py-3.5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                  <Sparkles className="size-4 animate-pulse" />
                </div>
                DN Smart Trade Intelligence Engine
              </CardTitle>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Customs AI Online
                </span>
              </div>
            </div>
          </CardHeader>

          {/* Chat Stream Body */}
          <CardContent className="flex flex-col flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="flex-1 p-4 sm:p-6">
              <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatMessageItem
                      key={i}
                      message={msg}
                      index={i}
                      onRegenerate={msg.role === "assistant" && i === messages.length - 1 ? () => handleSend() : undefined}
                    />
                  ))}

                  {/* Thinking Indicator */}
                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start gap-3.5"
                    >
                      <div className="size-9 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Bot className="size-5" />
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-xs bg-card border border-border/80 text-foreground shadow-xs flex items-center gap-2">
                        <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-2 bg-primary rounded-full animate-bounce" />
                        <span className="text-xs text-muted-foreground ml-2 font-medium">Analyzing tariff codes & shipment data...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggested Prompts Cards on First Turn */}
                {messages.length === 1 && (
                  <PromptSuggestions
                    prompts={suggestedPrompts}
                    onSelectPrompt={(promptText) => {
                      setQuery(promptText)
                    }}
                  />
                )}
              </div>
            </ScrollArea>

            {/* Input Controls Footer */}
            <ChatInputArea
              query={query}
              setQuery={setQuery}
              onSend={handleSend}
              isThinking={isThinking}
            />
          </CardContent>
        </Card>

        {/* Sidebar 2: Cited Sources Panel */}
        {showSources && (
          <div className="hidden xl:block w-72 shrink-0 h-full">
            <SourcesPanel />
          </div>
        )}
      </div>
    </div>
  )
}
