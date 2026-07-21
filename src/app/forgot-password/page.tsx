"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock logic
    setTimeout(() => {
      setIsSubmitting(false)
      toast({ 
        title: "Reset Link Sent", 
        description: "If this email exists in our system, you will receive a password reset link shortly." 
      })
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-y-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <motion.div 
        className="w-full max-w-md space-y-8 z-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-6 shadow-lg shadow-primary/20">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            DN Smart Trade
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enterprise ERP AI Platform
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-xl border-border/40 bg-card/60 backdrop-blur-xl">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl font-semibold text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center text-sm">
                Enter your email address and we will send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder=" "
                    className="peer pt-5 pb-1 h-12 bg-background/50 shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/50"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Label 
                    htmlFor="email"
                    className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary pointer-events-none"
                  >
                    Email address
                  </Label>
                </div>
                <Button type="submit" className="w-full h-11 text-sm shadow-md" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/40 p-5 bg-muted/10 rounded-b-xl">
              <p className="text-xs text-muted-foreground">
                Secure Enterprise Login &copy; {new Date().getFullYear()}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
