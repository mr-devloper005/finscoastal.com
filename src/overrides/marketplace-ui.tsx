import {
  BriefcaseBusiness,
  Building2,
  CarFront,
  CircleDollarSign,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  LucideIcon,
  PawPrint,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Ticket,
  Wrench,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'

export type MarketplaceContent = {
  address?: string
  author?: string
  body?: string
  category?: string
  condition?: string
  currency?: string
  description?: string
  email?: string
  excerpt?: string
  highlights?: string[]
  images?: string[]
  isNegotiable?: boolean
  location?: string
  logo?: string
  phone?: string
  price?: number | string
  priceRange?: string
  subcategory?: string
  views?: number | string
  website?: string
}

export const marketplaceCategoryIcons: Record<string, LucideIcon> = {
  'real-estate': Home,
  'cars-vehicles': CarFront,
  jobs: BriefcaseBusiness,
  'fashion-style': Shirt,
  'pets-plants': PawPrint,
  electronics: Smartphone,
  'electronics-video': Smartphone,
  furniture: Sofa,
  'furniture-home-decor': Sofa,
  services: Wrench,
  'health-beauty': HeartPulse,
  education: GraduationCap,
  'events-tickets': Ticket,
  freebies: Gift,
}

const stripHtml = (value?: string | null) =>
  (value || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export function extractMarketplaceContent(post: SitePost): MarketplaceContent {
  const content = post.content && typeof post.content === 'object' ? post.content : {}
  return content as MarketplaceContent
}

export function getMarketplaceImage(post: SitePost, content = extractMarketplaceContent(post)) {
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImages = Array.isArray(content.images) ? content.images : []
  const contentImage = contentImages.find((item) => typeof item === 'string' && item)
  return mediaUrl || contentImage || content.logo || '/placeholder.svg?height=900&width=1400'
}

export function getMarketplaceExcerpt(post: SitePost, content = extractMarketplaceContent(post), maxLength = 140) {
  const text = stripHtml(content.description || content.body || post.summary || content.excerpt || '')
  if (!text) return 'Browse the full details, seller info, and offer terms on this listing.'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}

export function getMarketplaceLocation(post: SitePost, content = extractMarketplaceContent(post)) {
  return content.address || content.location || post.authorName || ''
}

export function getMarketplaceCategory(post: SitePost, content = extractMarketplaceContent(post)) {
  return content.category || content.subcategory || post.tags?.[0] || 'General'
}

export function getMarketplacePrice(post: SitePost, content = extractMarketplaceContent(post)) {
  const raw = content.price ?? (post as unknown as { price?: number | string }).price
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw.replace(/[^\d.-]/g, ''))
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

export function getMarketplaceCurrency(post: SitePost, content = extractMarketplaceContent(post)) {
  return content.currency || (post as unknown as { currency?: string }).currency || 'USD'
}

export function formatMarketplacePrice(post: SitePost, content = extractMarketplaceContent(post)) {
  if (content.priceRange) return content.priceRange
  const price = getMarketplacePrice(post, content)
  if (price === null) return 'See details'

  const currency = getMarketplaceCurrency(post, content)
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `${currency} ${price.toLocaleString('en-IN')}`
  }
}

export function getMarketplaceTimeLabel(post: SitePost) {
  const raw = post.publishedAt || post.createdAt || post.updatedAt
  if (!raw) return 'Fresh today'

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return 'Fresh today'

  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)))
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

export function getMarketplaceIcon(category: string) {
  const key = category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return marketplaceCategoryIcons[key] || Sparkles
}

export function getConditionLabel(content: MarketplaceContent) {
  const raw = typeof content.condition === 'string' ? content.condition.trim() : ''
  if (!raw) return 'Verified seller'
  return raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getMarketplaceBadge(post: SitePost) {
  const price = getMarketplacePrice(post)
  if (price !== null) return CircleDollarSign
  return Building2
}
