"use client"

import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faBriefcase, faTableColumns, faUsers, faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
          <motion.div variants={itemVariants} className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-6 shadow-lg shadow-primary/20">
              <FontAwesomeIcon icon={faCircle} className="h-6 w-6 text-primary-foreground" />
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
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder=" "
                  className="peer pt-5 pb-1 h-12 bg-card/60 backdrop-blur-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/50"
                  required
                />
                <Label 
                  htmlFor="email"
                  className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary pointer-events-none"
                >
                  Email address
                </Label>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder=" "
                  className="peer pt-5 pb-1 h-12 bg-card/60 backdrop-blur-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/50"
                  required 
                />
                <Label 
                  htmlFor="password"
                  className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary pointer-events-none"
                >
                  Password
                </Label>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
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
              <Button type="submit" className="w-full h-11 text-sm shadow-md group">
                Sign In
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-11 bg-card/40 hover:bg-muted/50 border-border/60 transition-colors shadow-sm"
                onClick={() => handleDemoLogin("Admin")}
                type="button"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 mr-3">
                  <FontAwesomeIcon icon={faTableColumns} className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium">Login as Admin</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-11 bg-card/40 hover:bg-muted/50 border-border/60 transition-colors shadow-sm"
                onClick={() => handleDemoLogin("Employee")}
                type="button"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-500/10 mr-3">
                  <FontAwesomeIcon icon={faBriefcase} className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Login as Employee</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-11 bg-card/40 hover:bg-muted/50 border-border/60 transition-colors shadow-sm"
                onClick={() => handleDemoLogin("Client")}
                type="button"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded bg-green-500/10 mr-3">
                  <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">Login as Client</span>
              </Button>
            </div>
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
