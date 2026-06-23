import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Send, Sparkles } from "lucide-react"

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Trade Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Ask questions about trade regulations, HS code classifications, and shipment forecasts.
          </p>
        </div>
      </div>
      
      <Card className="flex flex-col flex-1 shadow-md border-primary/20">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            DN Smart Trade AI
          </CardTitle>
          <CardDescription>Powered by advanced trade logistics models.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-0">
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            {/* Example Chat Bubbles */}
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-xl rounded-tl-none max-w-[80%] text-sm">
                Hello! I am your AI Trade Assistant. How can I help you today? You can ask me to predict shipment delays or classify a product for customs.
              </div>
            </div>
            
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="text-xs text-secondary-foreground font-medium">AD</span>
              </div>
              <div className="bg-primary text-primary-foreground p-3 rounded-xl rounded-tr-none max-w-[80%] text-sm">
                What is the HS code for a laptop computer?
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-xl rounded-tl-none max-w-[80%] text-sm">
                The Harmonized System (HS) code for a laptop computer is generally <strong>8471.30.00</strong>, which covers "Portable automatic data processing machines, weighing not more than 10 kg, consisting of at least a central processing unit, a keyboard and a display."
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t bg-card mt-auto">
            <div className="relative flex items-center w-full">
              <Input 
                type="text" 
                placeholder="Message AI Assistant..." 
                className="pr-12 bg-muted/50 focus-visible:ring-primary"
              />
              <Button size="icon" variant="ghost" className="absolute right-1 text-primary">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
