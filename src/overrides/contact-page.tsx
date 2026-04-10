import { Building2, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { Footer } from '@/components/shared/footer'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { SITE_CONFIG } from '@/lib/site-config'

export const CONTACT_PAGE_OVERRIDE_ENABLED = true

const contactLanes = [
  {
    icon: Building2,
    title: 'Seller and business support',
    body: 'Questions about business pages, seller setup, or account details for local classifieds.',
  },
  {
    icon: Phone,
    title: 'Ad posting help',
    body: 'Get help with posting, category choice, or improving your listing before it goes live.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety and moderation',
    body: 'Report suspicious activity, account issues, or marketplace abuse through the proper channel.',
  },
]

export function ContactPageOverride() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f9ff_0%,#ffffff_42%,#f8fbff_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#0f7ff2_0%,#0871dd_58%,#0b6ad0_100%)] p-8 text-white shadow-[0_28px_70px_rgba(15,67,160,0.18)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Contact {SITE_CONFIG.name}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">A contact page styled like the rest of the classifieds product.</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/82">
              The contact experience now follows the same marketplace theme as login, register, and the rest of the site, instead of using a different visual language.
            </p>

            <div className="mt-8 grid gap-4">
              {contactLanes.map((lane) => (
                <div key={lane.title} className="rounded-[1.3rem] border border-white/14 bg-white/10 px-4 py-4">
                  <lane.icon className="h-5 w-5" />
                  <div className="mt-3 text-base font-semibold">{lane.title}</div>
                  <p className="mt-2 text-sm leading-7 text-white/78">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="market-panel rounded-[2.2rem] p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#edf5ff] text-[#0f7ff2]">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">Send a message</p>
                <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#13213c]">Tell us what you need help with</h2>
              </div>
            </div>

            <form className="mt-8 grid gap-4">
              <label className="market-soft-panel flex items-center gap-3 rounded-[1.2rem] px-4">
                <Mail className="h-5 w-5 text-[#0f7ff2]" />
                <input className="h-14 w-full bg-transparent text-sm text-[#13213c] outline-none" placeholder="Your email address" />
              </label>
              <label className="market-soft-panel flex items-center gap-3 rounded-[1.2rem] px-4">
                <Phone className="h-5 w-5 text-[#0f7ff2]" />
                <input className="h-14 w-full bg-transparent text-sm text-[#13213c] outline-none" placeholder="Phone number" />
              </label>
              <label className="market-soft-panel flex items-center gap-3 rounded-[1.2rem] px-4">
                <MapPin className="h-5 w-5 text-[#0f7ff2]" />
                <input className="h-14 w-full bg-transparent text-sm text-[#13213c] outline-none" placeholder="Topic or location" />
              </label>
              <textarea
                className="market-soft-panel min-h-[180px] rounded-[1.2rem] px-4 py-4 text-sm text-[#13213c] outline-none"
                placeholder="Share the full context so the team can respond with the right next step."
              />
              <button type="submit" className="market-action h-14">
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
