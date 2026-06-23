"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, Briefcase, LayoutDashboard, Users } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"

import { AuthService, UserRole } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await AuthService.login("admin@dnsmarttrade.com", "Admin")
    router.push("/dashboard")
  }

  const handleDemoLogin = async (role: UserRole) => {
    await AuthService.login("demo@dnsmarttrade.com", role)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4">
            <BarChart3 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            DN Smart Trade
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enterprise ERP AI Platform
          </p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Please use the credentials provided by your administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@dnsmarttrade.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleDemoLogin("Admin")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Login as Admin
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleDemoLogin("Employee")}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Login as Employee
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleDemoLogin("Client")}
              >
                <Users className="mr-2 h-4 w-4" />
                Login as Client
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-xs text-muted-foreground">
              Secure Enterprise Login &copy; {new Date().getFullYear()}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
