"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Camera, LogOut, Mail, MapPin, Shield, Trash2, User, Globe } from "lucide-react"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { Footer } from "@/components/shared/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { loadFromStorage, saveToStorage, storageKeys } from "@/lib/local-storage"

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [location, setLocation] = useState(user?.location || "")
  const [website, setWebsite] = useState(user?.website || "")

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showEmail, setShowEmail] = useState(false)
  const [allowMessages, setAllowMessages] = useState(true)

  useEffect(() => {
    const stored = loadFromStorage<any>(storageKeys.settings, {})
    if (stored.profileVisibility) setProfileVisibility(stored.profileVisibility)
    if (typeof stored.showEmail === "boolean") setShowEmail(stored.showEmail)
    if (typeof stored.allowMessages === "boolean") setAllowMessages(stored.allowMessages)
    if (typeof stored.emailNotifications === "boolean") setEmailNotifications(stored.emailNotifications)
    if (typeof stored.pushNotifications === "boolean") setPushNotifications(stored.pushNotifications)
    if (typeof stored.weeklyDigest === "boolean") setWeeklyDigest(stored.weeklyDigest)
  }, [])

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setBio(user.bio)
    setLocation(user.location || "")
    setWebsite(user.website || "")
  }, [user])

  const persistSettings = (next: Record<string, any>) => {
    const stored = loadFromStorage<Record<string, any>>(storageKeys.settings, {})
    saveToStorage(storageKeys.settings, { ...stored, ...next })
  }

  const notifyProfileUpdate = () => {
    window.dispatchEvent(new CustomEvent("nexus-profile-updated"))
  }

  const finishSave = (
    setSaving: (value: boolean) => void,
    title: string,
    description: string
  ) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({ title, description })
    }, 700)
  }

  const handleProfileSave = () => {
    if (!user) return
    updateUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      bio: bio.trim() || user.bio,
      location: location.trim() || undefined,
      website: website.trim() || undefined,
    })
    notifyProfileUpdate()
    finishSave(setIsSavingProfile, "Profile updated", "Your account details were saved.")
    setIsEditingProfile(false)
  }

  const handleNotificationSave = () => {
    persistSettings({
      emailNotifications,
      pushNotifications,
      weeklyDigest,
    })
    finishSave(setIsSavingNotifications, "Notifications updated", "Your notification preferences were saved.")
  }

  const handlePrivacySave = () => {
    persistSettings({
      profileVisibility,
      showEmail,
      allowMessages,
    })
    finishSave(setIsSavingPrivacy, "Privacy updated", "Your privacy settings were saved.")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAvatarUpload = (file: File | null) => {
    if (!file || !user) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image." })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2MB." })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      updateUser({ avatar: result })
      toast({ title: "Photo updated", description: "Your profile photo was updated." })
    }
    reader.readAsDataURL(file)
  }

  const handleProfileCancel = () => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setBio(user.bio)
    setLocation(user.location || "")
    setWebsite(user.website || "")
    setIsEditingProfile(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-lg">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your account details and preferences in one place.
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {user?.email || "No email"}
                  </span>
                  {user?.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Panel
            title="Profile"
            description="Update your photo, name, bio, and contact details."
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <button
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground"
                    onClick={() => {
                      if (!isEditingProfile) return
                      avatarInputRef.current?.click()
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <Input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleAvatarUpload(event.target.files?.[0] ?? null)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!isEditingProfile) return
                      avatarInputRef.current?.click()
                    }}
                    disabled={!isEditingProfile}
                  >
                    Upload photo
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} disabled={!isEditingProfile} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} disabled={!isEditingProfile} />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {isEditingProfile ? (
                  <>
                    <Button variant="outline" onClick={handleProfileCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleProfileSave} disabled={isSavingProfile}>
                      {isSavingProfile ? "Saving..." : "Save profile"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>Edit profile</Button>
                )}
              </div>
            </div>
          </Panel>

          <Panel
            title="Notifications"
            description="Choose which updates you want to receive."
          >
            <div className="space-y-4">
              {[
                {
                  icon: Bell,
                  label: "Email notifications",
                  description: "Receive important account updates by email.",
                  checked: emailNotifications,
                  onChange: setEmailNotifications,
                },
                {
                  icon: Bell,
                  label: "Push notifications",
                  description: "Get alerts in supported browsers and devices.",
                  checked: pushNotifications,
                  onChange: setPushNotifications,
                },
                {
                  icon: Bell,
                  label: "Weekly digest",
                  description: "Receive a weekly summary of your activity.",
                  checked: weeklyDigest,
                  onChange: setWeeklyDigest,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
                  <div className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label>{item.label}</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}

              <div className="flex justify-end">
                <Button onClick={handleNotificationSave} disabled={isSavingNotifications}>
                  {isSavingNotifications ? "Saving..." : "Save notifications"}
                </Button>
              </div>
            </div>
          </Panel>

          <Panel
            title="Privacy & Security"
            description="Control your visibility and account safety options."
          >
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Profile visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Account visibility</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Choose who can view your profile and contact settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
                <div>
                  <Label>Show email on profile</Label>
                  <p className="mt-1 text-sm text-muted-foreground">Allow your email address to appear publicly.</p>
                </div>
                <Switch checked={showEmail} onCheckedChange={setShowEmail} />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
                <div>
                  <Label>Allow direct messages</Label>
                  <p className="mt-1 text-sm text-muted-foreground">Let other users contact you through the platform.</p>
                </div>
                <Switch checked={allowMessages} onCheckedChange={setAllowMessages} />
              </div>

              <Separator />

              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">Delete account</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Permanently delete your account and all related data.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Request received",
                        description: "Account deletion requires confirmation.",
                      })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePrivacySave} disabled={isSavingPrivacy}>
                  {isSavingPrivacy ? "Saving..." : "Save privacy"}
                </Button>
              </div>
            </div>
          </Panel>

          <Panel
            title="Account Summary"
            description="A quick view of the core details attached to your account."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Name
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{user?.name || "Not set"}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{user?.email || "Not set"}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </div>
                <p className="mt-2 truncate text-sm text-muted-foreground">{user?.website || "Not set"}</p>
              </div>
            </div>
          </Panel>
        </div>
      </main>

      <Footer />
    </div>
  )
}
