import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, CarFront, Home, MapPin, PawPrint, Search, ShieldCheck, Shirt, Smartphone, Sofa, Sparkles, Wrench } from 'lucide-react'
import { Footer } from '@/components/shared/footer'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { ContentImage } from '@/components/shared/content-image'
import { AuthActionLink } from '@/overrides/auth-action-link'
import { getMarketplaceImage, getMarketplaceLocation } from '@/overrides/marketplace-ui'

export const HOME_PAGE_OVERRIDE_ENABLED = true

const categoryVisuals = [
  { label: 'Real Estate', slug: 'real-estate', icon: Home },
  { label: 'Cars & Vehicles', slug: 'cars-vehicles', icon: CarFront },
  { label: 'Jobs & Employment', slug: 'jobs', icon: BriefcaseBusiness },
  { label: 'Fashion & Style', slug: 'fashion-style', icon: Shirt },
  { label: 'Pets & Plants', slug: 'pets-plants', icon: PawPrint },
  { label: 'Electronics', slug: 'electronics', icon: Smartphone },
  { label: 'Furniture', slug: 'furniture-home-decor', icon: Sofa },
  { label: 'Services', slug: 'services', icon: Wrench },
]

export async function HomePageOverride() {
  const [classifiedPosts, listingPosts, profilePosts] = await Promise.all([
    fetchTaskPosts('classified', 8, { allowMockFallback: false, fresh: true }),
    fetchTaskPosts('listing', 6, { allowMockFallback: false, fresh: true }),
    fetchTaskPosts('profile', 4, { allowMockFallback: false, fresh: true }),
  ])

  const heroPosts = classifiedPosts.slice(0, 3)
  const trustedBusinesses = listingPosts.slice(0, 3)
  const sellerProfiles = profilePosts.slice(0, 3)

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0f7ff2_0%,#0871dd_58%,#0b6ad0_100%)] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,122,26,0.2),transparent_26%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Classified marketplace
                </span>
                <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] sm:text-6xl">
                  Easy to sell, quick to discover, built for local action.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
                  Find rentals, used goods, jobs, services, and everyday deals through a classifieds experience with better scanning, stronger trust cues, and faster response paths.
                </p>

                <form action="/search" className="mt-8 grid gap-3 rounded-[2rem] bg-white/14 p-4 backdrop-blur md:grid-cols-[1fr_1.1fr_auto]">
                  <label className="market-soft-panel flex h-16 items-center gap-3 rounded-[1.2rem] px-4 text-[#13213c]">
                    <MapPin className="h-5 w-5 text-[#0f7ff2]" />
                    <input className="h-full w-full bg-transparent text-sm outline-none" name="category" placeholder="City or area" aria-label="Location or category" />
                  </label>
                  <label className="market-soft-panel flex h-16 items-center gap-3 rounded-[1.2rem] px-4 text-[#13213c]">
                    <Search className="h-5 w-5 text-[#0f7ff2]" />
                    <input className="h-full w-full bg-transparent text-sm outline-none" name="q" placeholder="What are you looking for?" aria-label="Search query" />
                  </label>
                  <button type="submit" className="flex h-16 min-w-[180px] items-center justify-center gap-2 rounded-[1.2rem] border border-white/30 bg-white/10 px-6 text-lg font-semibold text-white transition-colors hover:bg-white/16">
                    <Search className="h-5 w-5" />
                    Search
                  </button>
                </form>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Fresh posts daily', 'Deals, rentals, gigs, and buyer demand in one place'],
                    ['Trust-first cards', 'Price, location, condition, and seller cues surfaced early'],
                    ['Quick listing flow', 'Built to convert views into messages and calls faster'],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-[1.4rem] border border-white/14 bg-white/10 p-4 backdrop-blur">
                      <div className="text-sm font-semibold">{title}</div>
                      <p className="mt-2 text-sm leading-6 text-white/76">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="market-panel rounded-[2rem] p-5 text-[#13213c]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5f6d87]">Featured now</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">High-intent ads people can act on today</h2>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-[#0f7ff2]" />
                </div>
                <div className="mt-5 space-y-3">
                  {heroPosts.map((post) => (
                    <Link key={post.id} href={`/classifieds/${post.slug}`} className="flex items-center gap-4 rounded-[1.3rem] border border-[rgba(15,48,107,0.08)] bg-[#f7fbff] p-3 transition-transform hover:-translate-y-0.5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem]">
                        <ContentImage src={getMarketplaceImage(post)} alt={post.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-1 text-base font-bold text-[#13213c]">{post.title}</div>
                        <div className="mt-1 line-clamp-1 text-sm text-[#5f6d87]">{getMarketplaceLocation(post) || 'Popular local listing'}</div>
                        <div className="mt-2 inline-flex rounded-full bg-[#ff7a1a]/12 px-3 py-1 text-xs font-semibold text-[#ea6610]">View deal</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[rgba(15,48,107,0.08)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              {categoryVisuals.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.slug}
                    href={`/classifieds?category=${item.slug}`}
                    className="group rounded-[1.4rem] border border-[rgba(15,48,107,0.08)] bg-[#fbfdff] px-4 py-5 text-center transition-all hover:-translate-y-1 hover:border-[#0f7ff2]/20 hover:shadow-[0_16px_36px_rgba(17,43,95,0.08)]"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5ff] text-[#0f7ff2] transition-colors group-hover:bg-[#0f7ff2] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-[#13213c]">{item.label}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-[rgba(15,48,107,0.08)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7ff2]">Newest listings</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#13213c]">Featured ads every day</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5f6d87]">A marketplace-style feed with stronger offer visibility, location cues, and better click targets for urgent actions.</p>
            </div>
            <Link href="/classifieds" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f7ff2] hover:text-[#0760c3]">
              See all classifieds
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {classifiedPosts.slice(0, 8).map((post) => (
              <TaskPostCard key={post.id} post={post} href={`/classifieds/${post.slug}`} taskKey="classified" />
            ))}
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className="market-panel rounded-[2rem] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7ff2]">Trusted local discovery</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#13213c]">Directory-style trust for the business side of the marketplace.</h2>
              <p className="mt-4 text-sm leading-8 text-[#5f6d87]">
                Businesses and service providers keep the same fast utility feel, but with cleaner verification cues, location metadata, and more direct call-to-action placement.
              </p>
              <div className="mt-6 grid gap-3">
                {trustedBusinesses.map((post) => (
                  <Link key={post.id} href={`/listings/${post.slug}`} className="rounded-[1.25rem] border border-[rgba(15,48,107,0.08)] bg-[#f8fbff] px-4 py-4 transition-all hover:-translate-y-0.5">
                    <div className="text-base font-bold text-[#13213c]">{post.title}</div>
                    <div className="mt-1 text-sm text-[#5f6d87]">{getMarketplaceLocation(post) || 'Local business listing'}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {sellerProfiles.map((post) => (
                <Link key={post.id} href={`/profile/${post.slug}`} className="market-panel overflow-hidden rounded-[1.7rem] transition-transform hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    <ContentImage src={getMarketplaceImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="market-chip">Trusted seller</div>
                    <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-[#13213c]">{post.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#5f6d87]">Profile surfaces that support business pages, seller credibility, and repeat local buyers.</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="market-panel rounded-[2rem] p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <span className="market-chip">Built for conversion</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[#13213c]">Post faster, scan faster, respond faster.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-[#5f6d87]">
                  This site now behaves like a proper classifieds product instead of a generic shared template: brighter urgency, clearer categories, stronger price placement, and tighter marketplace hierarchy from the homepage onward.
                </p>
                <AuthActionLink className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff7a1a] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(255,122,26,0.28)]">
                  Post your classified ad
                  <ArrowRight className="h-4 w-4" />
                </AuthActionLink>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {CATEGORY_OPTIONS.slice(0, 4).map((category) => (
                  <Link key={category.slug} href={`/classifieds?category=${category.slug}`} className="rounded-[1.3rem] border border-[rgba(15,48,107,0.08)] bg-[#fbfdff] p-5 transition-all hover:-translate-y-0.5">
                    <div className="text-sm font-semibold text-[#0f7ff2]">{category.name}</div>
                    <div className="mt-2 text-sm leading-7 text-[#5f6d87]">Open this category and explore marketplace-ready ad cards with quick action affordances.</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
