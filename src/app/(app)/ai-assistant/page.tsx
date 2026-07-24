"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faHashtag, faPlus, faPaperclip, faMicrophone, faFileLines, faSearch, faArrowRight, faChevronLeft, faMessage } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AuthService } from "@/lib/auth"

type Message = {
  role: "user" | "assistant"
  content: string
  sources?: string[]
}

export default function AIAssistantPage() {
  const currentUser = AuthService.getCurrentUser()
  const userInitials = currentUser?.name
    ? currentUser.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "AD"

  const [query, setQuery] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const suggestedPrompts = [
    { title: "Predict clearance time", desc: "For BOE-491 based on history", icon: <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-primary" aria-hidden="true" /> },
    { title: "HS Code Search", desc: "Find codes for electric vehicles", icon: <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-emerald-500" aria-hidden="true" /> },
    { title: "Summarize exports", desc: "Yesterday's export shipments", icon: <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 text-blue-500" aria-hidden="true" /> },
    { title: "Missing documents", desc: "Find issues for Apex Trading", icon: <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 text-amber-500" aria-hidden="true" /> }
  ]

  const handleSend = (e?: React.FormEvent, text?: string) => {
    if (e) e.preventDefault()
    const finalQuery = text || query
    if (!finalQuery.trim()) return

    const newMessages: Message[] = [...messages, { role: "user", content: finalQuery }]
    setMessages(newMessages)
    if (!text) setQuery("")
    setIsThinking(true)

    // Simulate AI response
    setTimeout(() => {
      setIsThinking(false)
      const assistantMessage: Message = {
        role: "assistant",
        content: "Based on my analysis of your historical data and current customs regulations, I can confirm that electric vehicles typically fall under HS Code **8703.80.00**.\n\nThis covers 'Motor cars and other motor vehicles principally designed for the transport of persons... powered solely by an electric motor'.\n\nI have cross-referenced this with the latest customs tariff book.",
        sources: ["Customs Tariff Book 2026", "Historical BOE-491"]
      }
      setMessages([...newMessages, assistantMessage])
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] animate-in fade-in duration-500 overflow-hidden bg-background">
      {/* Sidebar: History */}
      <motion.div 
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-muted/30 border-r border-border/50 overflow-hidden whitespace-nowrap"
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between min-w-[256px]">
          <h3 className="font-semibold text-sm">Chat History</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="New chat">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-2 min-w-[256px]">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground mt-2 mb-1">Today</div>
            {["HS Code Classification", "Shipment Delay Prediction"].map((chat, i) => (
              <button key={i} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted/80 transition-colors text-foreground line-clamp-1">
                {chat}
              </button>
            ))}
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground mt-4 mb-1">Previous 7 Days</div>
            {["Weekly Report Summary", "Apex Trading Docs", "Customs Duties Q3"].map((chat, i) => (
              <button key={i + 2} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground line-clamp-1">
                {chat}
              </button>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Main Chat Interface */}
      <div className="flex flex-col flex-1 relative bg-background overflow-hidden">
        {/* Toggle Sidebar Button */}
        <div className="absolute top-4 left-4 z-10 hidden lg:block">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-background shadow-sm hover:bg-muted/50 border-border/50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faMessage} className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </Button>
        </div>
        {messages.length === 0 ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faRobot} className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground text-sm max-w-md text-center mb-8">
              I can help you classify products, predict shipment delays, or summarize complex logistics data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, prompt.title)}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="p-2 rounded-md bg-muted">
                    {prompt.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{prompt.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{prompt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat Messages
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-8">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                    )}

                    <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 text-[15px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-muted text-foreground rounded-2xl rounded-tr-sm'
                          : 'text-foreground'
                      }`}>
                        {msg.content.split('\n').map((line: string, j: number) => (
                          <span key={j}>
                            {line.includes('**') ? (
                              <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            ) : (
                              line
                            )}
                            {j !== msg.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>

                      {msg.sources && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sources:</span>
                          {msg.sources.map((source: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                              <FontAwesomeIcon icon={faFileLines} className="h-3 w-3" aria-hidden="true" />
                              {source}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div
                        className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1 font-semibold text-xs text-foreground"
                        aria-label={`${currentUser?.name ?? "User"} message`}
                      >
                        {userInitials}
                      </div>
                    )}
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="px-4 py-3 text-[15px] flex items-center gap-2" aria-label="AI is thinking">
                      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="p-4 bg-background">
          <div className="max-w-3xl mx-auto w-full relative">
            <form onSubmit={(e) => handleSend(e)} className="relative flex flex-col w-full rounded-2xl border border-border bg-muted/30 focus-within:bg-background focus-within:ring-1 focus-within:ring-border focus-within:border-border transition-all duration-200">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about shipments, BOEs, or customs..."
                className="w-full min-h-[56px] max-h-32 resize-none bg-transparent px-4 py-4 text-[15px] focus:outline-none scrollbar-hide placeholder:text-muted-foreground"
                aria-label="Message input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" aria-label="Attach file">
                    <FontAwesomeIcon icon={faPaperclip} className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" aria-label="Voice input">
                    <FontAwesomeIcon icon={faMicrophone} className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!query.trim() || isThinking}
                  className={`h-8 w-8 rounded-lg transition-colors ${query.trim() ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  aria-label="Send message"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </form>
            <div className="text-center mt-2 text-xs text-muted-foreground">
              AI Assistant can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
