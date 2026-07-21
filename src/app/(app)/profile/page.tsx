"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, Settings, Activity } from "lucide-react"
import { toast } from "sonner"
import { useState, useRef } from "react"

export default function ProfilePage() {
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("https://github.com/shadcn.png")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSavingPersonal, setIsSavingPersonal] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)

  const [activities, setActivities] = useState<{action: string, date: string}[]>([
    { action: "Logged in from Chrome (Windows)", date: new Date().toLocaleString() },
    { action: "Enabled Two-Factor Authentication", date: "Oct 10, 2023, 10:00:00 AM" }
  ])

  const addActivity = (action: string) => {
    setActivities(prev => [{ action, date: new Date().toLocaleString() }, ...prev])
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const handleAvatarChange = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsUpdatingAvatar(true)
    setTimeout(() => {
      setIsUpdatingAvatar(false)
      toast.success("Avatar updated successfully!")
      addActivity("Updated Profile Avatar")
    }, 1000)
  }

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingPersonal(true)
    setTimeout(() => {
      setIsSavingPersonal(false)
      toast.success("Personal information saved successfully!")
      addActivity("Updated Personal Information")
    }, 1000)
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get("new") as string
    const confirmPassword = formData.get("confirm") as string

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm New Password do not match!")
      return
    }

    setIsUpdatingPassword(true)
    setTimeout(() => {
      setIsUpdatingPassword(false)
      toast.success("Password updated successfully!")
      addActivity("Changed Password")
      ;(e.target as HTMLFormElement).reset()
    }, 1000)
  }

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingPreferences(true)
    setTimeout(() => {
      setIsSavingPreferences(false)
      toast.success("Preferences saved successfully!")
      addActivity("Updated Preferences")
    }, 1000)
  }

  const handleEnable2FA = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.info("Two-Factor Authentication setup instructions sent to your email.")
    addActivity("Initiated Two-Factor Authentication Setup")
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, preferences, and view your activity.
        </p>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="size-4" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="size-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="size-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="size-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Avatar & Public Profile</CardTitle>
              <CardDescription>Update how you appear to others.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/gif" 
                onChange={handleFileChange} 
              />
              <Avatar 
                className="size-24 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={handleAvatarClick}
              >
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" onClick={handleAvatarChange} disabled={isUpdatingAvatar}>
                  {isUpdatingAvatar ? "Uploading..." : "Save Avatar"}
                </Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handlePersonalSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your contact details and basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Admin" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="User" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="admin@dnsmarttrade.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingPersonal}>
                  {isSavingPersonal ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" name="new" type="password" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" name="confirm" type="password" required minLength={8} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Not configured</p>
                </div>
                <Button variant="outline" onClick={handleEnable2FA}>Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handlePreferencesSubmit}>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="email-notif" defaultChecked />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start space-x-3">
                  <Checkbox id="sms-notif" />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="sms-notif">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get text messages for important events.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start space-x-3">
                  <Checkbox id="marketing" />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="marketing">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and product updates.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingPreferences}>
                  {isSavingPreferences ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Review your recent account actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-muted-foreground">{item.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
