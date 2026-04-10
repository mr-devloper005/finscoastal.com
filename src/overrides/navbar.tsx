'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, LayoutGrid, Menu, Search, Tag, User, X } from 'lucide-react'
import { NavbarAuthControls } from '@/components/shared/navbar-auth-controls'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { useAuth } from '@/lib/auth-context'
import { AuthActionLink } from '@/overrides/auth-action-link'

export const NAVBAR_OVERRIDE_ENABLED = true

const taskIcons: Partial<Record<TaskKey, any>> = {
  classified: Tag,
  listing: Building2,
  profile: User,
}

export function NavbarOverride() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigation = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && ['classified', 'listing', 'profile'].includes(task.key)),
    []
  )

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    router.push(params.toString() ? `/search?${params.toString()}` : '/search')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(15,48,107,0.1)] bg-white/92 backdrop-blur-xl">
      <div className="border-b border-[rgba(15,48,107,0.08)] bg-[linear-gradient(90deg,#f7fbff_0%,#fff7ef_100%)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs text-[#5f6d87] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#20b15a]" />
            Live local classifieds, rental leads, jobs, and resale offers
          </div>
          <Link href="/search" className="hidden font-semibold text-[#0f7ff2] hover:text-[#0760c3] sm:inline-flex">
            Browse all ads
          </Link>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-[linear-gradient(135deg,#0f7ff2_0%,#2b9eff_100%)] text-white shadow-[0_16px_36px_rgba(15,127,242,0.28)]">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-extrabold tracking-[-0.04em] text-[#13213c]">{SITE_CONFIG.name}</div>
            <div className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">Fast local buys, sales, and services</div>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-2 rounded-full border border-[rgba(15,48,107,0.1)] bg-[#f7fbff] p-1.5">
            {navigation.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              const active = pathname.startsWith(task.route)
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'bg-[#0f7ff2] text-white shadow-[0_12px_24px_rgba(15,127,242,0.22)]' : 'text-[#4f5f7e] hover:bg-white hover:text-[#13213c]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {task.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-[rgba(15,48,107,0.1)] bg-[#f7fbff] p-1.5">
            <Search className="ml-3 h-4 w-4 text-[#0f7ff2]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ads"
              className="h-10 w-44 bg-transparent pr-2 text-sm text-[#13213c] outline-none"
              aria-label="Search ads"
            />
            <button type="submit" className="rounded-full bg-[#0f7ff2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0760c3]">
              Search
            </button>
          </form>
          {isAuthenticated ? (
            <NavbarAuthControls />
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-[#0f7ff2] transition-colors hover:text-[#0760c3]">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-semibold text-[#13213c] transition-colors hover:text-[#0f7ff2]">
                Register
              </Link>
              <AuthActionLink className="market-action min-w-[178px]">
                Post Free Ad
              </AuthActionLink>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          {!isAuthenticated ? (
            <AuthActionLink className="market-action px-4 py-2.5 text-sm">
              Post Ad
            </AuthActionLink>
          ) : (
            <NavbarAuthControls />
          )}
          <Button variant="ghost" size="icon" className="rounded-full border border-[rgba(15,48,107,0.1)]" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[rgba(15,48,107,0.08)] bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
            <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-[1.1rem] border border-[rgba(15,48,107,0.1)] bg-[#f7fbff] px-4 py-2">
              <Search className="h-4 w-4 text-[#0f7ff2]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search ads, services, and local sellers"
                className="h-10 w-full bg-transparent text-sm text-[#13213c] outline-none"
                aria-label="Search ads mobile"
              />
              <button type="submit" className="rounded-full bg-[#0f7ff2] px-4 py-2 text-sm font-semibold text-white">
                Go
              </button>
            </form>
            {navigation.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              const active = pathname.startsWith(task.route)
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-sm font-semibold ${
                    active ? 'bg-[#0f7ff2] text-white' : 'border border-[rgba(15,48,107,0.1)] bg-white text-[#13213c]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {task.label}
                </Link>
              )
            })}
            {!isAuthenticated ? (
              <div className="grid gap-3 pt-1">
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-[rgba(15,48,107,0.12)] px-4 py-3 text-center text-sm font-semibold text-[#13213c]">
                  Sign In
                </Link>
                <AuthActionLink onClick={() => setOpen(false)} className="rounded-full bg-[#0f7ff2] px-4 py-3 text-center text-sm font-semibold text-white">
                  Create account
                </AuthActionLink>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
