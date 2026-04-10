'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, BadgeCheck, Mail, ShieldCheck, Sparkles, User2 } from 'lucide-react'
import { Footer } from '@/components/shared/footer'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/use-toast'

export const REGISTER_PAGE_OVERRIDE_ENABLED = true

export function RegisterPageOverride() {
  const router = useRouter()
  const { signup, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, router])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await signup(name, email, password)
    toast({
      title: 'Account created',
      description: 'Your account is ready and you are now signed in on this device.',
    })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f9ff_0%,#ffffff_42%,#f8fbff_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#0f7ff2_0%,#0871dd_58%,#0b6ad0_100%)] p-8 text-white shadow-[0_28px_70px_rgba(15,67,160,0.18)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Marketplace signup
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Create your classifieds account in the same style as the rest of the site.</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/82">
              Open an account to post ads, manage seller details, and keep your activity synced locally after signup. The layout now matches the login and marketplace theme instead of using a separate visual style.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                'Same blue/orange marketplace UI as the rest of the site.',
                'Direct signup flow with local saved session after success.',
                'Cleaner onboarding focused on posting and account setup.',
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
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">Create account</p>
                <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#13213c]">Start posting, buying, and managing ads</h2>
              </div>
            </div>

            <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
              <label className="market-soft-panel flex items-center gap-3 rounded-[1.2rem] px-4">
                <User2 className="h-5 w-5 text-[#0f7ff2]" />
                <input
                  className="h-14 w-full bg-transparent text-sm text-[#13213c] outline-none"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  required
                />
              </label>
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
                <BadgeCheck className="h-5 w-5 text-[#0f7ff2]" />
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
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-[#5f6d87] sm:flex-row sm:items-center sm:justify-between">
              <span>Already have an account?</span>
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-[#0f7ff2] hover:text-[#0760c3]">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
