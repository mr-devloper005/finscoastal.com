import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin, ShieldCheck, Tag } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
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

export const TASK_POST_CARD_OVERRIDE_ENABLED = true

export function TaskPostCardOverride({
  post,
  href,
  taskKey,
  compact,
}: {
  post: SitePost
  href: string
  taskKey?: TaskKey
  compact?: boolean
}) {
  const content = extractMarketplaceContent(post)
  const image = getMarketplaceImage(post, content)
  const location = getMarketplaceLocation(post, content)
  const category = getMarketplaceCategory(post, content)
  const price = formatMarketplacePrice(post, content)
  const timeLabel = getMarketplaceTimeLabel(post)
  const condition = getConditionLabel(content)
  const isClassified = taskKey === 'classified'
  const isListing = taskKey === 'listing'
  const isProfile = taskKey === 'profile'
  const imageAspect = isClassified ? 'aspect-[4/3]' : isProfile ? 'aspect-[5/4]' : 'aspect-[16/11]'

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-[rgba(15,48,107,0.1)] bg-white shadow-[0_18px_54px_rgba(17,43,95,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(15,67,160,0.16)] ${
        compact ? 'rounded-[1.45rem]' : ''
      }`}
    >
      <div className={`relative overflow-hidden bg-[#eaf3ff] ${imageAspect}`}>
        <ContentImage
          src={image}
          alt={`${post.title} image`}
          fill
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 360px"
          quality={75}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          intrinsicWidth={960}
          intrinsicHeight={720}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c214a]/72 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/94 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7ff2] shadow-sm">
            <Tag className="h-3.5 w-3.5" />
            {category}
          </span>
          <span className="rounded-full bg-[#13213c] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            {condition}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="rounded-full bg-[linear-gradient(135deg,#ff7a1a_0%,#ea6610_100%)] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_26px_rgba(255,122,26,0.3)]">
            {isListing ? 'View profile' : price}
          </div>
          <div className="rounded-full bg-white/90 p-2 text-[#13213c] shadow-sm">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-xl font-extrabold leading-snug tracking-[-0.03em] text-[#13213c]">
            {post.title}
          </h3>
          {isProfile || isListing ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#edf5ff] px-2.5 py-1 text-[11px] font-semibold text-[#0f7ff2]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5f6d87]">
          {getMarketplaceExcerpt(post, content, compact ? 100 : 150)}
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#5f6d87]">
          {location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#0f7ff2]" />
              {location}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-[#0f7ff2]" />
            {timeLabel}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between rounded-[1rem] bg-[#f7fbff] px-4 py-3">
            <span className="text-sm font-semibold text-[#13213c]">
              {isProfile ? 'Open seller profile' : isListing ? 'See business details' : 'Open full ad'}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f7ff2]">
              {isClassified ? 'Fast response' : 'More info'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
