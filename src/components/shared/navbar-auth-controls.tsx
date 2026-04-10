'use client'

import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import { AuthActionLink } from '@/overrides/auth-action-link'

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  return (
    <>
      <AuthActionLink className="hidden h-10 items-center gap-1 rounded-full bg-[#ff7a1a] px-4 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(255,122,26,0.24)] hover:bg-[#ea6610] sm:inline-flex">
        Create Ad
      </AuthActionLink>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full text-[#4f5f7e] hover:bg-[rgba(15,127,242,0.08)] hover:text-[#0f7ff2]">
            <Avatar className="h-9 w-9 border border-[rgba(15,48,107,0.12)]">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-[rgba(15,48,107,0.12)] bg-[rgba(255,255,255,0.98)]">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10 border border-[rgba(15,48,107,0.12)]">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-[#5f6d87]">{user?.email}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
