"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCircle, faPlus, faPaperclip, faMicrophone, faFileLines, faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  role: "user" | "assistant"
  content: string
  sources?: string[]
}

export default function AIAssistantPage() {
  const [query, setQuery] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const suggestedPrompts = [
    { title: "Predict clearance time", desc: "For BOE-491 based on history", icon: <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-primary" /> },
    { title: "HS Code Search", desc: "Find codes for electric vehicles", icon: <FontAwesomeIcon icon={faCircle} className="w-4 h-4 text-emerald-500" /> },
    { title: "Summarize exports", desc: "Yesterday's export shipments", icon: <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 text-blue-500" /> },
    { title: "Missing documents", desc: "Find issues for Apex Trading", icon: <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 text-amber-500" /> }
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
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Trade Assistant</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Intelligent conversational interface for logistics and enterprise data.
        </p>
      </div>
      
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar: History */}
        <div className="hidden lg:flex flex-col w-72 bg-card/60 backdrop-blur-md rounded-3xl border border-border/40 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faCircle} className="h-4 w-4" />
              Chat History
            </h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 mb-1">Today</div>
              {["HS Code Classification", "Shipment Delay Prediction"].map((chat, i) => (
                <button key={i} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors text-foreground line-clamp-1">
                  {chat}
                </button>
              ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-4 mb-1">Previous 7 Days</div>
              {["Weekly Report Summary", "Apex Trading Docs", "Customs Duties Q3"].map((chat, i) => (
                <button key={i+2} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground line-clamp-1">
                  {chat}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Interface */}
        <div className="flex flex-col flex-1 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-border/50 bg-card/60 backdrop-blur-3xl overflow-hidden relative">
          
          {messages.length === 0 ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
                <FontAwesomeIcon icon={faCircle} className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground max-w-md text-center mb-10">
                I can help you classify products, predict shipment delays, or summarize complex logistics data.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                {suggestedPrompts.map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(undefined, prompt.title)}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 text-left group"
                  >
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors">
                      {prompt.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{prompt.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{prompt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat Messages
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
              <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pb-10">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-[22px] rounded-tr-[4px] shadow-sm' 
                            : 'bg-card/80 backdrop-blur-sm border border-border/50 text-foreground rounded-[22px] rounded-tl-[4px] shadow-sm'
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
                              <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                                <FontAwesomeIcon icon={faFileLines} className="h-3 w-3" />
                                {source}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.role === 'user' && (
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1 font-medium text-xs">
                          US
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isThinking && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start gap-4"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-primary" />
                      </div>
                      <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-muted/40 border border-border/50 flex items-center gap-2 shadow-sm">
                        <span className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-background/40 backdrop-blur-2xl border-t border-border/30">
            <div className="max-w-3xl mx-auto w-full relative">
              <form onSubmit={(e) => handleSend(e)} className="relative flex flex-col w-full rounded-[24px] border border-border/50 bg-background/80 shadow-[0_2px_20px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all duration-300">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about shipments, BOEs, or customs..." 
                  className="w-full min-h-[56px] max-h-32 resize-none bg-transparent px-4 py-4 text-[15px] focus:outline-none scrollbar-hide placeholder:text-muted-foreground/70"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <div className="flex items-center justify-between px-3 pb-3 pt-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/50 hover:text-foreground">
                      <FontAwesomeIcon icon={faPaperclip} className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/50 hover:text-foreground">
                      <FontAwesomeIcon icon={faMicrophone} className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!query.trim() || isThinking}
                    className={`h-8 w-8 rounded-full transition-all ${query.trim() ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <div className="text-center mt-3 text-[11px] text-muted-foreground font-medium">
                AI Assistant can make mistakes. Verify important information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
