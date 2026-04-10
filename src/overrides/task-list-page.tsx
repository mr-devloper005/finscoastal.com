import Link from 'next/link'
import { ArrowRight, MapPin, Search, Sparkles, Tag } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { AuthActionLink } from '@/overrides/auth-action-link'

export const TASK_LIST_PAGE_OVERRIDE_ENABLED = true

export async function TaskListPageOverride({ task, category }: { task: TaskKey; category?: string }) {
  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))

  const accentTitle =
    task === 'classified'
      ? 'Newest classified ads'
      : task === 'listing'
        ? 'Local business directory'
        : task === 'profile'
          ? 'Seller and business profiles'
          : taskConfig?.label || task

  const accentBody =
    task === 'classified'
      ? 'Scan faster with offer-first cards, tighter spacing, stronger location cues, and clearer response paths.'
      : task === 'listing'
        ? 'Browse trusted local businesses in a cleaner discovery layout that feels closer to a marketplace than a generic directory.'
        : task === 'profile'
          ? 'Profiles now look like part of the same marketplace system, with stronger trust surfaces and easier browsing.'
          : 'This task surface has been restyled to match the marketplace system while keeping all data and task logic unchanged.'

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f9ff_0%,#ffffff_36%,#f8fbff_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
            url: `${baseUrl}${taskConfig?.route || ''}`,
            hasPart: schemaItems,
          }}
        />

        <section className="overflow-hidden rounded-[2.3rem] border border-[rgba(15,48,107,0.08)] bg-[linear-gradient(135deg,#0f7ff2_0%,#0871dd_58%,#0b6ad0_100%)] text-white shadow-[0_28px_70px_rgba(15,67,160,0.18)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-10 lg:py-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5" />
                {taskConfig?.label || task}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">{accentTitle}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/82">{accentBody}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#13213c]">
                  <Search className="h-4 w-4 text-[#0f7ff2]" />
                  Search all ads
                </Link>
                <AuthActionLink className="inline-flex items-center gap-2 rounded-full bg-[#ff7a1a] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(255,122,26,0.28)]">
                  Post free ad
                  <ArrowRight className="h-4 w-4" />
                </AuthActionLink>
              </div>
            </div>

            <form action={taskConfig?.route || '#'} className="rounded-[1.8rem] bg-white/12 p-4 backdrop-blur">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="market-soft-panel flex items-center gap-3 rounded-[1.15rem] px-4 text-[#13213c]">
                  <Tag className="h-5 w-5 text-[#0f7ff2]" />
                  <select name="category" defaultValue={normalizedCategory} className="h-14 w-full bg-transparent text-sm outline-none">
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="rounded-[1.15rem] border border-white/24 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/16">
                  Apply filters
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  'Strong price and urgency visibility',
                  'Mobile-friendly scan rhythm',
                  'Cleaner route into seller details',
                ].map((item) => (
                  <div key={item} className="rounded-[1rem] bg-white/10 px-3 py-3 text-xs font-medium text-white/82">
                    {item}
                  </div>
                ))}
              </div>
            </form>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="market-panel rounded-[1.8rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7ff2]">Browsing note</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#13213c]">Marketplace-first navigation</h2>
            <p className="mt-3 text-sm leading-7 text-[#5f6d87]">
              The layout now treats every feed like a classifieds surface, with stronger scannability, clearer filtering, and less visual filler around the results.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-[1rem] bg-[#f7fbff] px-4 py-3 text-sm text-[#5f6d87]">
              <MapPin className="h-4 w-4 text-[#0f7ff2]" />
              Category filtering remains unchanged; only the presentation has been upgraded.
            </div>
          </div>

          {intro ? (
            <div className="market-panel rounded-[1.8rem] p-6">
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#13213c]">{intro.title}</h2>
              {intro.paragraphs.slice(0, 2).map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-7 text-[#5f6d87]">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-8">
          <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
