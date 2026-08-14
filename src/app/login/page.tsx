"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BrandLogo } from "@/components/brand-logo"
import { signIn } from "@/actions/auth.actions"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function LoginPage() {
  const router = useRouter()
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const res = await signIn(formData)
      
      if (res.success) {
        router.push("/dashboard")
      } else {
        setError(res.error || "Failed to sign in")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side: Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-y-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <motion.div 
          className="w-full max-w-[380px] space-y-8 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center space-y-2 text-center relative z-10 mb-8">
            <BrandLogo width={48} height={48} />
            <h1 className="text-2xl font-bold tracking-tight">
              DN Smart Trade
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to DN Smart Trade Enterprise ERP
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder=" "
                  className="peer pt-5 pb-1 h-12 bg-card/60 backdrop-blur-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/50"
                  required
                />
                <Label 
                  htmlFor="email"
                  className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary pointer-events-none"
                >
                  Email or Username
                </Label>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder=" "
                  className="peer pt-5 pb-1 pr-10 h-12 bg-card/60 backdrop-blur-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/50"
                  required 
                />
                <Label 
                  htmlFor="password"
                  className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary pointer-events-none"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={remember}
                    onCheckedChange={(val) => setRemember(Boolean(val))}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full h-11 text-sm shadow-md group" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side: High-quality logistics image */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden">
        <Image
          src="/logistics_login_bg.png"
          alt="Global Logistics Container Terminal"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-10000 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-4 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              System Operational
            </div>
            <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Powering Global Trade</h3>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              Streamline your import-export operations with our AI-driven enterprise logistics platform.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
