import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Clock3, Globe, Mail, MapPin, Phone, ShieldCheck, Tag } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { TaskImageCarousel } from '@/components/tasks/task-image-carousel'
import { ArticleComments } from '@/components/tasks/article-comments'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { RichContent, formatRichHtml } from '@/components/shared/rich-content'
import {
  extractMarketplaceContent,
  formatMarketplacePrice,
  getConditionLabel,
  getMarketplaceCategory,
  getMarketplaceExcerpt,
  getMarketplaceImage,
  getMarketplaceLocation,
  getMarketplaceTimeLabel,
} from '@/overrides/marketplace-ui'

export const TASK_DETAIL_PAGE_OVERRIDE_ENABLED = true

const isValidImageUrl = (value?: string | null) =>
  typeof value === 'string' && (value.startsWith('/') || /^https?:\/\//i.test(value))

const absoluteUrl = (value?: string | null) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (!value.startsWith('/')) return null
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${value}`
}

const formatArticleHtml = (post: SitePost) => {
  const content = extractMarketplaceContent(post)
  const raw =
    (typeof content.body === 'string' && content.body.trim()) ||
    (typeof content.description === 'string' && content.description.trim()) ||
    (typeof post.summary === 'string' && post.summary.trim()) ||
    ''

  return formatRichHtml(raw, 'Details coming soon.')
}

const getImageUrls = (post: SitePost) => {
  const content = extractMarketplaceContent(post)
  const media = Array.isArray(post.media) ? post.media : []
  const mediaImages = media.map((item) => item?.url).filter((url): url is string => isValidImageUrl(url))
  const contentImages = Array.isArray(content.images) ? content.images.filter((url): url is string => isValidImageUrl(url)) : []
  const merged = [...mediaImages, ...contentImages]
  if (merged.length) return merged
  if (isValidImageUrl(content.logo)) return [content.logo as string]
  const fallback = getMarketplaceImage(post, content)
  return fallback ? [fallback] : ['/placeholder.svg?height=900&width=1400']
}

const toNumber = (value?: number | string) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const buildMapEmbedUrl = (latitude?: number | string, longitude?: number | string, address?: string) => {
  const lat = toNumber(latitude)
  const lon = toNumber(longitude)
  const normalizedAddress = typeof address === 'string' ? address.trim() : ''
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim()

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress
    if (!query) return null
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsEmbedApiKey)}&q=${encodeURIComponent(query)}`
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`
  }

  return null
}

export async function TaskDetailPageOverride({ task, slug }: { task: TaskKey; slug: string }) {
  const taskConfig = getTaskConfig(task)
  const post = await fetchTaskPostBySlug(task, slug)

  if (!post) {
    notFound()
  }

  const content = extractMarketplaceContent(post)
  const isArticle = task === 'article'
  const isBookmark = task === 'sbm' || task === 'social'
  const isClassified = task === 'classified'
  const category = getMarketplaceCategory(post, content)
  const description = content.description || post.summary || 'Details coming soon.'
  const descriptionHtml = !isArticle ? formatRichHtml(description, 'Details coming soon.') : ''
  const articleHtml = isArticle ? formatArticleHtml(post) : ''
  const articleSummary = post.summary || content.excerpt || ''
  const articleAuthor = content.author || post.authorName || 'Editorial Team'
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === 'string') : []
  const location = getMarketplaceLocation(post, content)
  const images = getImageUrls(post)
  const mapEmbedUrl = buildMapEmbedUrl((content as any).latitude, (content as any).longitude, location)
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      const itemContent = extractMarketplaceContent(item)
      return !content.category || itemContent.category === content.category
    })
    .slice(0, 3)

  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${taskConfig?.route || '/articles'}/${post.slug}`
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage)
  const articleSchema = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          '@type': 'Person',
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(', '),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.baseUrl.replace(/\/$/, '') },
      { '@type': 'ListItem', position: 2, name: taskConfig?.label || 'Posts', item: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${taskConfig?.route || '/'}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${taskConfig?.route || '/posts'}/${post.slug}` },
    ],
  }

  const price = formatMarketplacePrice(post, content)
  const condition = getConditionLabel(content)
  const timeLabel = getMarketplaceTimeLabel(post)
  const hideSidebar = isArticle || isBookmark

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f9ff_0%,#ffffff_38%,#f8fbff_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema} />

        <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f7ff2] hover:text-[#0760c3]">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to {taskConfig?.label || 'posts'}
        </Link>

        <section className="mt-6 overflow-hidden rounded-[2.2rem] border border-[rgba(15,48,107,0.08)] bg-white shadow-[0_24px_68px_rgba(17,43,95,0.08)]">
          <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="market-chip">{category}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#edf5ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0f7ff2]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fff7ef] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ea6610]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {condition}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#13213c] sm:text-5xl">{post.title}</h1>

              {isArticle ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5f6d87]">
                  <span>By {articleAuthor}</span>
                  {articleDate ? <span>{articleDate}</span> : null}
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 text-sm text-[#5f6d87]">
                  {location ? (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#0f7ff2]" />
                      {location}
                    </span>
                  ) : null}
                  {content.phone ? (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#0f7ff2]" />
                      {content.phone}
                    </span>
                  ) : null}
                </div>
              )}

              {isArticle ? (
                <>
                  {articleSummary ? <p className="max-w-3xl text-base leading-8 text-[#5f6d87]">{articleSummary}</p> : null}
                  <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(15,48,107,0.08)] bg-[#eaf3ff]">
                    <img src={images[0]} alt={`${post.title} featured`} className="h-auto w-full object-cover" />
                  </div>
                </>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-[#f7fbff] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f6d87]">Price</div>
                    <div className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#13213c]">{price}</div>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#f7fbff] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f6d87]">Category</div>
                    <div className="mt-2 text-lg font-bold text-[#13213c]">{category}</div>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#f7fbff] p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f6d87]">Status</div>
                    <div className="mt-2 text-lg font-bold text-[#13213c]">{condition}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[1.8rem] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7ff2]">
                {isArticle ? 'Article summary' : isClassified ? 'Contact this seller' : 'Business contact'}
              </div>
              <p className="mt-4 text-sm leading-7 text-[#5f6d87]">
                {isArticle
                  ? 'This premium article layout preserves the same content, schema, and comments while giving the reading surface a stronger branded editorial shell.'
                  : getMarketplaceExcerpt(post, content, 180)}
              </p>

              {!isArticle ? (
                <div className="mt-5 space-y-3 text-sm text-[#13213c]">
                  {content.website ? (
                    <a href={content.website} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-[1rem] border border-[rgba(15,48,107,0.08)] bg-white px-4 py-3 hover:border-[#0f7ff2]/20">
                      <Globe className="mt-0.5 h-4 w-4 text-[#0f7ff2]" />
                      <span className="break-all">{content.website}</span>
                    </a>
                  ) : null}
                  {content.email ? (
                    <a href={`mailto:${content.email}`} className="flex items-start gap-3 rounded-[1rem] border border-[rgba(15,48,107,0.08)] bg-white px-4 py-3 hover:border-[#0f7ff2]/20">
                      <Mail className="mt-0.5 h-4 w-4 text-[#0f7ff2]" />
                      <span className="break-all">{content.email}</span>
                    </a>
                  ) : null}
                  {content.phone ? (
                    <div className="flex items-start gap-3 rounded-[1rem] border border-[rgba(15,48,107,0.08)] bg-white px-4 py-3">
                      <Phone className="mt-0.5 h-4 w-4 text-[#0f7ff2]" />
                      <span>{content.phone}</span>
                    </div>
                  ) : null}
                  {location ? (
                    <div className="flex items-start gap-3 rounded-[1rem] border border-[rgba(15,48,107,0.08)] bg-white px-4 py-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-[#0f7ff2]" />
                      <span>{location}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {!isArticle ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {content.website ? (
                    <Button asChild className="h-12 rounded-full bg-[#0f7ff2] text-white hover:bg-[#0760c3]">
                      <a href={content.website} target="_blank" rel="noreferrer">Visit website</a>
                    </Button>
                  ) : (
                    <Button className="h-12 rounded-full bg-[#0f7ff2] text-white hover:bg-[#0760c3]">Message seller</Button>
                  )}
                  <Button variant="outline" className="h-12 rounded-full border-[rgba(15,48,107,0.12)] bg-white">
                    Save listing
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className={`mt-8 grid gap-8 ${hideSidebar ? 'lg:grid-cols-1' : 'lg:grid-cols-[1.2fr_0.8fr]'}`}>
          <div className="space-y-8">
            {!isArticle && !isBookmark ? (
              <section className="market-panel rounded-[2rem] p-4 sm:p-6">
                <TaskImageCarousel images={images} />
              </section>
            ) : null}

            <section className="market-panel rounded-[2rem] p-6 sm:p-8">
              {isArticle ? (
                <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
              ) : (
                <RichContent html={descriptionHtml} className="max-w-none" />
              )}

              {content.highlights?.length && !isArticle ? (
                <div className="mt-8 rounded-[1.5rem] bg-[#f7fbff] p-5">
                  <h2 className="text-lg font-extrabold tracking-[-0.03em] text-[#13213c]">Highlights</h2>
                  <ul className="mt-4 space-y-2 text-sm text-[#5f6d87]">
                    {content.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[#0f7ff2]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {isArticle ? <ArticleComments slug={post.slug} /> : null}
            </section>
          </div>

          {!hideSidebar ? (
            <aside className="space-y-6">
              <section className="market-panel rounded-[1.8rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7ff2]">Seller summary</p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#13213c]">{price}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-[#edf5ff] text-[#0f7ff2]">{category}</Badge>
                  <Badge variant="secondary" className="bg-[#fff7ef] text-[#ea6610]">{condition}</Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#5f6d87]">
                  {isClassified ? 'Fast-contact modules keep offers actionable without changing the underlying listing data.' : 'This side panel keeps key contact and business details visible while the main content stays easy to scan.'}
                </p>
              </section>

              {mapEmbedUrl ? (
                <section className="market-panel rounded-[1.8rem] p-4">
                  <p className="px-2 text-sm font-semibold text-[#13213c]">Location map</p>
                  <div className="mt-3 overflow-hidden rounded-[1.2rem] border border-[rgba(15,48,107,0.08)]">
                    <iframe title="Location map" src={mapEmbedUrl} className="h-64 w-full" loading="lazy" />
                  </div>
                </section>
              ) : null}
            </aside>
          ) : null}
        </div>

        <section className="mt-12">
          {related.length ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7ff2]">Related posts</p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#13213c]">More in {category}</h2>
                </div>
                {taskConfig?.route ? (
                  <Link href={taskConfig.route} className="text-sm font-semibold text-[#0f7ff2] hover:text-[#0760c3]">
                    View all
                  </Link>
                ) : null}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <TaskPostCard key={item.id} post={item} href={buildPostUrl(task, item.slug)} taskKey={task} />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  )
}
