import { Mail, MessageSquareText, ShieldCheck } from 'lucide-react';

import { ContactLeadForm } from '@/components/shared/contact-lead-form';
import { Footer } from '@/components/shared/footer';
import { NavbarShell } from '@/components/shared/navbar-shell';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Fins Coastal';

const contactHighlights = [
  { icon: Mail, title: 'Direct response', copy: 'Your message is saved securely and routed to the right team.' },
  { icon: MessageSquareText, title: 'Clear details', copy: 'Share your requirement, question, or collaboration idea in one place.' },
  { icon: ShieldCheck, title: 'Reliable follow-up', copy: 'We keep the request record so every conversation stays traceable.' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7f1e8] text-stone-950">
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden px-6 py-20 md:px-10 lg:px-16">
          <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-[-8%] h-80 w-80 rounded-full bg-stone-300/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-stone-500">Contact</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-stone-950 md:text-7xl">
                Let&apos;s talk about your next move.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
                Use this form to reach {siteName}. Your request will be recorded and shared with the support team for follow-up.
              </p>

              <div className="mt-8 grid gap-4">
                {contactHighlights.map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-3xl border border-stone-200 bg-white/60 p-5 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-stone-950">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ContactLeadForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
