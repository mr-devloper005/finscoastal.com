import Link from 'next/link'
import { ArrowRight, Building2, CircleHelp, ShieldCheck, Tag } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { AuthActionLink } from '@/overrides/auth-action-link'

export const FOOTER_OVERRIDE_ENABLED = true

const footerGroups = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Classifieds', href: '/classifieds' },
      { label: 'Search All Ads', href: '/search' },
      { label: 'Post an Ad', href: '/create/classified' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'How It Works', href: '/about' },
      { label: 'Safety Tips', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' },
    ],
  },
]

export function FooterOverride() {
  return (
    <footer className="border-t border-[rgba(15,48,107,0.1)] bg-[linear-gradient(180deg,#f4f9ff_0%,#eef6ff_100%)] text-[#13213c]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-[rgba(15,48,107,0.1)] bg-white/90 p-7 shadow-[0_24px_64px_rgba(17,43,95,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#0f7ff2_0%,#2b9eff_100%)] text-white shadow-[0_14px_28px_rgba(15,127,242,0.22)]">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-[-0.04em]">{SITE_CONFIG.name}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">Marketplace-first local discovery</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#5f6d87]">
              Buy, sell, rent, hire, and promote with a classifieds interface designed for fast scanning, strong trust cues, and quick action on every device.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] bg-[#f4f9ff] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-[#0f7ff2]" />
                  Verified-ready surfaces
                </div>
                <p className="mt-2 text-xs leading-6 text-[#5f6d87]">Clear seller details, category labels, and compact listing structure.</p>
              </div>
              <div className="rounded-[1.2rem] bg-[#fff7ef] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Building2 className="h-4 w-4 text-[#ff7a1a]" />
                  Built for local demand
                </div>
                <p className="mt-2 text-xs leading-6 text-[#5f6d87]">Useful for rentals, jobs, services, deals, and business postings.</p>
              </div>
            </div>
            <AuthActionLink className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0f7ff2] hover:text-[#0760c3]">
              Post your first ad
              <ArrowRight className="h-4 w-4" />
            </AuthActionLink>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">{group.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-[#0f7ff2]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[rgba(15,48,107,0.1)] pt-5 text-sm text-[#5f6d87] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CircleHelp className="h-4 w-4" />
            Fast-moving ads should stay clear, responsive, and trustworthy.
          </div>
          <div>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
