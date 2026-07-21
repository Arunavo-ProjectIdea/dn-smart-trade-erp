"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BarChart3, Briefcase, LayoutDashboard, Users } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { AuthService, UserRole } from "@/lib/auth"

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await AuthService.login("admin@dnsmarttrade.com", "Admin")
    window.location.replace("/dashboard")
  }

  const handleDemoLogin = async (role: UserRole) => {
    await AuthService.login("demo@dnsmarttrade.com", role)
    window.location.replace("/dashboard")
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side: Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-sm space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-6 shadow-lg shadow-primary/20">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to DN Smart Trade Enterprise ERP
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative mt-2">
                <Input
                  id="email"
                  type="email"
                  placeholder=" "
                  className="peer pt-5 pb-1 h-12 bg-card"
                  required
                />
                <Label 
                  htmlFor="email"
                  className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary"
                >
                  Email
                </Label>
              </div>
              <div className="relative mt-2">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder=" "
                  className="peer pt-5 pb-1 h-12 bg-card"
                  required 
                />
                <Label 
                  htmlFor="password"
                  className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary"
                >
                  Password
                </Label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left bg-card"
                onClick={() => handleDemoLogin("Admin")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                Login as Admin
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left bg-card"
                onClick={() => handleDemoLogin("Employee")}
              >
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                Login as Employee
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left bg-card"
                onClick={() => handleDemoLogin("Client")}
              >
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                Login as Client
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side: High-quality logistics image */}
      <div className="hidden lg:flex w-1/2 relative bg-card">
        <Image
          src="/logistics_login_bg.png"
          alt="Global Logistics Container Terminal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Powering Global Trade</h3>
            <p className="text-white/80">Streamline your import-export operations with our AI-driven enterprise logistics platform.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
