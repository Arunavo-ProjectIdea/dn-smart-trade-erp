"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShieldHalved, faGear, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import { getUserProfile, updateUserPassword } from "@/actions/auth.actions"
import { Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    getUserProfile().then((res) => {
      if (res.success && res.data) setCurrentUser(res.data)
      setIsLoading(false)
    })
  }, [])

  const nameParts = (currentUser?.full_name as string | undefined)?.split(" ") || []
  const firstName = nameParts[0] || "Admin"
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "User"

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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const phone = formData.get("phone") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    
    setIsSavingPersonal(true)
    
    const fullName = `${firstName} ${lastName}`.trim()
    
    const res = await updateUserProfile({
      phone,
      full_name: fullName
    })
    
    setIsSavingPersonal(false)
    
    if (res.success) {
      toast.success("Personal information saved successfully!")
      addActivity("Updated Personal Information")
    } else {
      toast.error(res.error || "Failed to update profile.")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get("new") as string
    const confirmPassword = formData.get("confirm") as string

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm New Password do not match!")
      return
    }

    setIsUpdatingPassword(true)
    const res = await updateUserPassword(newPassword)
    setIsUpdatingPassword(false)
    
    if (res.success) {
      toast.success("Password updated successfully!")
      addActivity("Changed Password")
      ;(e.target as HTMLFormElement).reset()
    } else {
      toast.error(res.error || "Failed to update password.")
    }
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

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>
  }

  if (!currentUser) {
    return <div className="p-8 text-center text-muted-foreground">Failed to load profile.</div>
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
            <FontAwesomeIcon icon={faUser} className="size-4" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="size-4" aria-hidden="true" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faGear} className="size-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} className="size-4" />
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
                <AvatarFallback>{(firstName[0] ?? "A") + (lastName[0] ?? "U")}</AvatarFallback>
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
              <CardContent className="space-y-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" defaultValue={firstName} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" defaultValue={lastName} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={(currentUser?.email as string) ?? "admin@dnsmarttrade.com"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={(currentUser?.phone as string) ?? "+880 "} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={(currentUser?.department as string) ?? "Not assigned"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" defaultValue={(currentUser?.designation as string) ?? "Not assigned"} disabled />
                  </div>
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
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="current">Current Password</Label>
                  <div className="relative">
                    <Input id="current" type={showCurrentPassword ? "text" : "password"} required />
                    <Button 
                      type="button" variant="ghost" size="icon" 
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="new">New Password</Label>
                  <div className="relative">
                    <Input id="new" name="new" type={showNewPassword ? "text" : "password"} required minLength={8} />
                    <Button 
                      type="button" variant="ghost" size="icon" 
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <div className="relative">
                    <Input id="confirm" name="confirm" type={showConfirmPassword ? "text" : "password"} required minLength={8} />
                    <Button 
                      type="button" variant="ghost" size="icon" 
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
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
              <CardContent className="space-y-4 pb-6">
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
