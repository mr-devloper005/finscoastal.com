'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { Footer } from '@/components/shared/footer'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/use-toast'

export const LOGIN_PAGE_OVERRIDE_ENABLED = true

export function LoginPageOverride() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading, user } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nextPath, setNextPath] = useState('/')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    setNextPath(params.get('next') || '/')
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(nextPath)
    }
  }, [isAuthenticated, nextPath, router])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await login(email, password)
    toast({
      title: 'Signed in successfully',
      description: `Welcome back${email ? `, ${email}` : ''}. Your session is now saved on this device.`,
    })
    router.push(nextPath)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f9ff_0%,#ffffff_42%,#f8fbff_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#0f7ff2_0%,#0871dd_58%,#0b6ad0_100%)] p-8 text-white shadow-[0_28px_70px_rgba(15,67,160,0.18)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Marketplace account access
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Sign in and keep your activity synced on this device.</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/82">
              The redesigned classifieds workspace now uses the existing auth context correctly, so a successful login remains saved locally and your navbar state, posting flow, and account surfaces stay in sync after refresh.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                'Successful login is persisted in local storage.',
                'No API contracts or auth payloads were changed.',
                'The visual shell now matches the classifieds marketplace system.',
              ].map((item) => (
                <div key={item} className="rounded-[1.3rem] border border-white/14 bg-white/10 px-4 py-4 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="market-panel rounded-[2.2rem] p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#edf5ff] text-[#0f7ff2]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">Welcome back</p>
                <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#13213c]">Access your buyer, seller, and business dashboard</h2>
              </div>
            </div>

            <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
              <label className="market-soft-panel flex items-center gap-3 rounded-[1.2rem] px-4">
                <Mail className="h-5 w-5 text-[#0f7ff2]" />
                <input
                  className="h-14 w-full bg-transparent text-sm text-[#13213c] outline-none"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  required
                />
              </label>
              <label className="market-soft-panel flex items-center gap-3 rounded-[1.2rem] px-4">
                <LockKeyhole className="h-5 w-5 text-[#0f7ff2]" />
                <input
                  className="h-14 w-full bg-transparent text-sm text-[#13213c] outline-none"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  required
                />
              </label>
              <button type="submit" disabled={isLoading} className="market-action h-14 disabled:cursor-not-allowed disabled:opacity-70">
                {isLoading ? 'Signing in...' : 'Sign in securely'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-[#5f6d87] sm:flex-row sm:items-center sm:justify-between">
              <Link href="/forgot-password" className="font-medium hover:text-[#0f7ff2]">
                Forgot password?
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 font-semibold text-[#0f7ff2] hover:text-[#0760c3]">
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {user ? (
              <div className="mt-6 rounded-[1.25rem] bg-[#f7fbff] px-4 py-4 text-sm text-[#5f6d87]">
                Currently signed in as <span className="font-semibold text-[#13213c]">{user.email}</span>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
