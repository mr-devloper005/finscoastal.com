import Link from 'next/link'
import { ArrowRight, Globe, Mail, MapPin, Phone, ShieldCheck, Tag } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { RichContent, formatRichHtml } from '@/components/shared/rich-content'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function DirectoryTaskDetailPage({
  task,
  taskLabel,
  taskRoute,
  post,
  description,
  category,
  images,
  mapEmbedUrl,
  related,
}: {
  task: TaskKey
  taskLabel: string
  taskRoute: string
  post: SitePost
  description: string
  category: string
  images: string[]
  mapEmbedUrl: string | null
  related: SitePost[]
}) {
  const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const location =
    typeof content.address === 'string'
      ? content.address
      : typeof content.location === 'string'
        ? content.location
        : ''
  const website = typeof content.website === 'string' ? content.website : ''
  const phone = typeof content.phone === 'string' ? content.phone : ''
  const email = typeof content.email === 'string' ? content.email : ''
  const highlights = Array.isArray(content.highlights)
    ? content.highlights.filter((item): item is string => typeof item === 'string')
    : []
  const postedBy =
    (typeof content.author === 'string' && content.author.trim()) ||
    (typeof post.authorName === 'string' && post.authorName.trim()) ||
    ''
  const postedDateRaw = post.publishedAt || post.createdAt || post.updatedAt || null
  const postedDate = postedDateRaw
    ? new Date(postedDateRaw).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''
  const descriptionHtml = formatRichHtml(description, 'Details coming soon.')
  const schemaPayload = {
    '@context': 'https://schema.org',
    '@type': task === 'profile' ? 'Organization' : 'LocalBusiness',
    name: post.title,
    description,
    image: images[0],
    url: `${taskRoute}/${post.slug}`,
    address: location || undefined,
    telephone: phone || undefined,
    email: email || undefined,
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <SchemaJsonLd data={schemaPayload} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-950">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <Link href={taskRoute} className="hover:text-slate-950">
            {taskLabel}
          </Link>
          {category ? (
            <>
              <span className="text-slate-400">/</span>
              <span className="font-medium text-slate-700">{category}</span>
            </>
          ) : null}
        </nav>

        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={taskRoute}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            ← Back to {taskLabel}
          </Link>
          {postedDate ? <span className="text-xs font-medium text-slate-500">Posted: {postedDate}</span> : null}
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            {location ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
                <MapPin className="h-4 w-4 text-slate-500" />
                {location}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <Tag className="h-4 w-4 text-slate-500" />
              {category || taskLabel}
            </span>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <ContentImage src={images[0]} alt={post.title} fill className="object-cover" />
              </div>
              {images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3 p-4">
                  {images.slice(1, 5).map((image) => (
                    <div
                      key={image}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <ContentImage src={image} alt={post.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {website || phone || email || postedBy ? (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Details</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  {website ? (
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-4 w-4 text-slate-500" />
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all font-medium text-slate-950 hover:underline"
                      >
                        {website}
                      </a>
                    </div>
                  ) : null}
                  {phone ? (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-slate-500" />
                      <span>{phone}</span>
                    </div>
                  ) : null}
                  {email ? (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                      <a href={`mailto:${email}`} className="break-all font-medium text-slate-950 hover:underline">
                        {email}
                      </a>
                    </div>
                  ) : null}
                  {postedBy ? (
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-500" />
                      <span>
                        Posted by <span className="font-medium text-slate-950">{postedBy}</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Visit website <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  <Link
                    href={taskRoute}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
                  >
                    Browse more
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Description</p>
              <RichContent
                html={descriptionHtml}
                className="mt-4 leading-8 prose-p:my-5 prose-li:my-2 prose-h2:my-6 prose-h3:my-5"
              />
            </article>

            {highlights.length ? (
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Highlights</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {highlights.slice(0, 6).map((item) => (
                    <div key={item} className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {mapEmbedUrl ? (
              <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <div className="border-b border-slate-200 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Location</p>
                </div>
                <iframe
                  src={mapEmbedUrl}
                  title={`${post.title} map`}
                  className="h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </section>
            ) : null}
          </div>
        </section>

        {related.length ? (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">More like this</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More in {category || taskLabel}</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                <Tag className="h-3.5 w-3.5" /> {taskLabel}
              </span>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard key={item.id} post={item} href={`${taskRoute}/${item.slug}`} taskKey={task} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

