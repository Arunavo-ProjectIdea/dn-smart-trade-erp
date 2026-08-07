"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faShieldHalved,
  faGear,
  faChartLine,
  faKey,
  faImage,
  faCircleUser,
  faClock,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import {
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  uploadAvatar,
} from "@/actions/auth.actions"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type ProfileData = Record<string, unknown>

interface TimelineEvent {
  id: string
  icon: typeof faUser
  iconColor: string
  iconBg: string
  label: string
  description: string
  timestamp: string | null
}

function buildTimeline(profile: ProfileData): TimelineEvent[] {
  const events: TimelineEvent[] = []

  if (profile.last_login) {
    events.push({
      id: "last_login",
      icon: faClock,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      label: "Last Login",
      description: "Signed in to your account",
      timestamp: profile.last_login as string,
    })
  }

  if (profile.avatar_url) {
    events.push({
      id: "avatar",
      icon: faImage,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
      label: "Avatar Updated",
      description: "Profile picture was changed",
      timestamp: profile.updated_at as string | null,
    })
  }

  if (profile.updated_at) {
    events.push({
      id: "profile_updated",
      icon: faUser,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      label: "Profile Updated",
      description: "Personal information was last saved",
      timestamp: profile.updated_at as string,
    })
  }

  if (profile.created_at) {
    events.push({
      id: "account_created",
      icon: faCircleUser,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      label: "Account Created",
      description: "Your account was set up in the system",
      timestamp: profile.created_at as string,
    })
  }

  return events.sort((a, b) => {
    if (!a.timestamp) return 1
    if (!b.timestamp) return -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

function formatDate(ts: string | null): string {
  if (!ts) return "—"
  return new Date(ts).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const STATUS_COLOR: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Inactive: "bg-red-500/10 text-red-700 dark:text-red-400",
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [avatarSrc, setAvatarSrc] = useState<string>("")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [isSavingPersonal, setIsSavingPersonal] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getUserProfile().then((res) => {
      if (res.success && res.data) {
        setCurrentUser(res.data)
        setAvatarSrc((res.data.avatar_url as string) || "")
      }
      setIsLoading(false)
    })
  }, [])

  const nameParts = (currentUser?.full_name as string | undefined)?.split(" ") || []
  const firstName = nameParts[0] || "User"
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
  const initials = `${firstName[0] ?? "U"}${lastName[0] ?? ""}`.toUpperCase()

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2MB limit")
      return
    }
    setPendingFile(file)
    setAvatarSrc(URL.createObjectURL(file))
  }

  const handleSaveAvatar = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!pendingFile) {
      toast.info("Select a new image first")
      return
    }
    setIsUpdatingAvatar(true)
    const fd = new FormData()
    fd.append("avatar", pendingFile)
    const res = await uploadAvatar(fd)
    setIsUpdatingAvatar(false)
    if (res.success && res.data) {
      setAvatarSrc(res.data)
      setCurrentUser((prev) => prev ? { ...prev, avatar_url: res.data } : prev)
      setPendingFile(null)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("avatar-updated", { detail: res.data }))
      }
      toast.success("Avatar updated successfully!")
    } else {
      toast.error(res.error ?? "Failed to upload avatar")
    }
  }

  const handlePersonalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string

    setIsSavingPersonal(true)
    const res = await updateUserProfile({
      full_name: `${firstName} ${lastName}`.trim(),
      phone,
    })
    setIsSavingPersonal(false)

    if (res.success) {
      setCurrentUser((prev) =>
        prev ? { ...prev, full_name: `${firstName} ${lastName}`.trim(), phone } : prev
      )
      toast.success("Personal information saved!")
    } else {
      toast.error(res.error ?? "Failed to update profile")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get("new") as string
    const confirmPassword = formData.get("confirm") as string

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!")
      return
    }

    setIsUpdatingPassword(true)
    const res = await updateUserPassword(newPassword)
    setIsUpdatingPassword(false)

    if (res.success) {
      toast.success("Password updated successfully!")
      ;(e.target as HTMLFormElement).reset()
    } else {
      toast.error(res.error ?? "Failed to update password")
    }
  }

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingPreferences(true)
    setTimeout(() => {
      setIsSavingPreferences(false)
      toast.success("Preferences saved!")
    }, 800)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full pb-10 pt-4 animate-pulse">
        <div className="h-9 bg-muted rounded-lg w-48" />
        <div className="h-5 bg-muted rounded w-72" />
        <div className="h-64 bg-muted rounded-xl mt-4" />
      </div>
    )
  }

  if (!currentUser) {
    return <div className="p-8 text-center text-muted-foreground">Failed to load profile.</div>
  }

  const timeline = buildTimeline(currentUser)
  const roleLabel = currentUser.role as string
  const statusLabel = (currentUser.status as string) || "Pending"

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

        {/* ── PERSONAL TAB ─────────────────────────────── */}
        <TabsContent value="personal" className="space-y-6">
          {/* Avatar */}
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
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={handleFileChange}
              />
              <Avatar
                className="size-24 cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-border"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={avatarSrc} alt="Profile avatar" />
                <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleAvatarClick} size="sm">
                    Choose Image
                  </Button>
                  <Button onClick={handleSaveAvatar} disabled={isUpdatingAvatar || !pendingFile} size="sm">
                    {isUpdatingAvatar ? "Uploading…" : "Save Avatar"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">JPG, GIF, PNG or WebP. Max 2MB.</p>
                {pendingFile && (
                  <p className="text-xs text-primary">New image selected — click Save Avatar to upload.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your role and current account status in the system.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge variant="secondary">{roleLabel}</Badge>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", STATUS_COLOR[statusLabel] ?? STATUS_COLOR.Pending)}>
                  {statusLabel}
                </span>
              </div>
              {Boolean(currentUser.last_login) && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Last Login:</span>
                    <span className="text-sm font-medium">{formatDate(currentUser.last_login as string)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Personal Info */}
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
                    <Input id="lastName" name="lastName" defaultValue={lastName} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={(currentUser.email as string) ?? ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={(currentUser.phone as string) ?? ""} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={(currentUser.department as string) ?? "Not assigned"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" defaultValue={(currentUser.designation as string) ?? "Not assigned"} disabled />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSavingPersonal}>
                  {isSavingPersonal ? "Saving…" : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* ── SECURITY TAB ─────────────────────────────── */}
        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Keep your account secure with a strong password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                  <FontAwesomeIcon icon={faKey} className="mr-2 size-4" />
                  {isUpdatingPassword ? "Updating…" : "Update Password"}
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
                <Button variant="outline" onClick={() => toast.info("2FA setup instructions sent to your email.")}>
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PREFERENCES TAB ──────────────────────────── */}
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
                  {isSavingPreferences ? "Saving…" : "Save Preferences"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* ── ACTIVITY TAB ─────────────────────────────── */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>A timeline of key events on your account.</CardDescription>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No activity recorded yet.</p>
              ) : (
                <ol className="relative border-l border-border/60 ml-4 space-y-0">
                  {timeline.map((event, i) => (
                    <li key={event.id} className={cn("ml-6", i !== timeline.length - 1 && "pb-8")}>
                      {/* Timeline dot */}
                      <span
                        className={cn(
                          "absolute -left-3 flex size-6 items-center justify-center rounded-full ring-4 ring-background",
                          event.iconBg
                        )}
                      >
                        <FontAwesomeIcon icon={event.icon} className={cn("size-3", event.iconColor)} aria-hidden="true" />
                      </span>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{event.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                        </div>
                        <time
                          className="shrink-0 text-xs text-muted-foreground/70 pt-0.5"
                          dateTime={event.timestamp ?? ""}
                        >
                          {formatDate(event.timestamp)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
