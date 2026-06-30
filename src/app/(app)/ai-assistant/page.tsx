"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, Sparkles, Command, History, CornerDownLeft } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AIAssistantPage() {
  const [query, setQuery] = useState("")
  const [isThinking, setIsThinking] = useState(false)
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
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "Based on my analysis of your historical data and current customs regulations, I can confirm that electric vehicles typically fall under HS Code 8703.80.00. This covers 'Motor cars and other motor vehicles principally designed for the transport of persons... powered solely by an electric motor'."
      }])
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Trade Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Intelligent conversational interface for logistics and enterprise data.
        </p>
      </div>
      
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar: History */}
        <Card className="hidden lg:flex flex-col w-80 bg-card border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" />
              Conversation History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4">
              <div className="space-y-2">
                {["HS Code Classification", "Shipment Delay Prediction", "Weekly Report Summary"].map((chat, i) => (
                  <button key={i} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground line-clamp-1">
                    {chat}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Chat Interface */}
        <Card className="flex flex-col flex-1 shadow-md border-border bg-card overflow-hidden">
          <CardHeader className="border-b bg-muted/20 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              DN Smart Trade Intelligence
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="flex-1 p-6">
              <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {msg.role === 'user' ? 'US' : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${
                        msg.role === 'user' 
                          ? 'bg-muted text-foreground rounded-tr-sm' 
                          : 'bg-background border border-border text-foreground rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isThinking && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start gap-4"
                    >
                      <div className="h-8 w-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-background border border-border text-foreground shadow-sm flex items-center gap-2">
                        <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            <div className="p-4 bg-card border-t border-border">
              <div className="max-w-3xl mx-auto w-full space-y-4">
                {/* Suggested Prompts */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <button 
                        key={i}
                        onClick={() => { setQuery(prompt); }}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Input Area */}
                <form onSubmit={handleSend} className="relative flex items-end w-full rounded-xl border border-input bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-shadow">
                  <textarea 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Message AI Assistant..." 
                    className="w-full min-h-[60px] max-h-32 resize-none bg-transparent p-4 text-sm focus:outline-none scrollbar-hide"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <div className="p-2 shrink-0">
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!query.trim() || isThinking}
                      className="h-9 w-9 rounded-lg"
                    >
                      <CornerDownLeft className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </form>
                <div className="flex justify-between items-center px-1 text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
                  <span>AI models can make mistakes</span>
                  <span className="flex items-center gap-1"><Command className="h-3 w-3" /> + Enter to send</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
