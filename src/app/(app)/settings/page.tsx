"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, ShieldCheck, Bell, Link as LinkIcon, Eye, EyeOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function SettingsPage() {
  const [isSavingOrg, setIsSavingOrg] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)
  const [isSavingAlerts, setIsSavingAlerts] = useState(false)
  const [isSavingConfig, setIsSavingConfig] = useState(false)

  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("sk_live_1234567890abcdef")

  const handleSaveOrganization = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingOrg(true)
    setTimeout(() => {
      setIsSavingOrg(false)
      toast.success("Organization details saved successfully!")
    }, 1000)
  }

  const handleApplySecurity = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSecurity(true)
    setTimeout(() => {
      setIsSavingSecurity(false)
      toast.success("Security policies applied successfully!")
    }, 1000)
  }

  const handleSaveAlerts = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingAlerts(true)
    setTimeout(() => {
      setIsSavingAlerts(false)
      toast.success("Alert preferences saved successfully!")
    }, 1000)
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingConfig(true)
    setTimeout(() => {
      setIsSavingConfig(false)
      toast.success("Integration configuration saved successfully!")
    }, 1000)
  }

  const handleRegenerateApiKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2, 18)
    setApiKey(newKey)
    toast.info("API Key regenerated. Make sure to save configuration.")
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure application preferences, security, and system integrations.
        </p>
      </div>
      
      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="size-4" />
            <span>Organization</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="size-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <LinkIcon className="size-4" />
            <span>Integrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handleSaveOrganization}>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Update the primary business details used on invoices and reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="DN Smart Trade Ltd." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input id="regNumber" defaultValue="TR-998822" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Registered Address</Label>
                  <Input id="address" defaultValue="123 Logistics Avenue, Trade City" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry / Sector</Label>
                  <Select defaultValue="logistics">
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logistics">Logistics & Supply Chain</SelectItem>
                      <SelectItem value="retail">Retail & E-Commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingOrg}>
                  {isSavingOrg ? "Saving..." : "Save Organization"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handleApplySecurity}>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
                <CardDescription>Manage global security policies for all users in the organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox id="req-2fa" defaultChecked />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="req-2fa">Enforce Two-Factor Authentication (2FA)</Label>
                    <p className="text-sm text-muted-foreground">Require all users in the organization to use 2FA.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox id="req-pw" defaultChecked />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="req-pw">Strict Password Policy</Label>
                    <p className="text-sm text-muted-foreground">Require uppercase, lowercase, numbers, and symbols.</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="timeout">Idle Session Timeout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="timeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Minutes</SelectItem>
                      <SelectItem value="30">30 Minutes</SelectItem>
                      <SelectItem value="60">1 Hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingSecurity}>
                  {isSavingSecurity ? "Applying..." : "Apply Security Policies"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handleSaveAlerts}>
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Manage how and when you receive system alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="email-daily" defaultChecked />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="email-daily">Daily Digests</Label>
                    <p className="text-sm text-muted-foreground">Receive a daily summary of system activity via email.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start space-x-3">
                  <Checkbox id="sms-critical" defaultChecked />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="sms-critical">Critical SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get text messages immediately for critical shipment delays or errors.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start space-x-3">
                  <Checkbox id="webhook" />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="webhook">Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">Forward alerts to configured external webhooks (e.g. Slack/Discord).</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingAlerts}>
                  {isSavingAlerts ? "Saving..." : "Save Alerts"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handleSaveConfig}>
              <CardHeader>
                <CardTitle>API Keys & Endpoints</CardTitle>
                <CardDescription>Connect to third-party logistics providers and customs portals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Production API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      type={showApiKey ? "text" : "password"} 
                      value={apiKey} 
                      readOnly 
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="flex items-center gap-2"
                    >
                      {showApiKey ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                      {showApiKey ? "Hide" : "Reveal"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleRegenerateApiKey}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="size-4"/>
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Keep this key secret. It grants full access to your organization data.</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL Endpoint</Label>
                  <Input id="webhook-url" type="url" placeholder="https://yourdomain.com/webhook" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingConfig}>
                  {isSavingConfig ? "Saving..." : "Save Configuration"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
